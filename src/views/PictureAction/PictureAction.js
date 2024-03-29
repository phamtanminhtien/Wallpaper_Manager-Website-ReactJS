import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  Grid,
  Card,
  CardHeader,
  Button,
  Divider,
  FormControl,
  CardContent,
  FormLabel,
  Radio,
  TextField,
  RadioGroup,
  FormControlLabel,
  CardActions,
  FormGroup,
  Checkbox,
  IconButton,
  LinearProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText
} from '@material-ui/core';
import { useParams } from 'react-router-dom';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import SaveIcon from '@material-ui/icons/Save';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import ClearIcon from '@material-ui/icons/Clear';
import { database } from '../../firebase';
import { storage } from '../../firebase';
import firebase from '../../firebase';
const [URL, UPLOAD] = [0, 1];
const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  margin: {
    paddingTop: theme.spacing(2)
  },
  container: {
    position: 'relative'
  },
  actions: {
    justifyContent: 'flex-end'
  }
}));

const PictureAction = () => {
  const { id } = useParams();
  const classes = useStyles();
  const tagInputRef = useRef();
  const fileInputRef = useRef();
  const urlInputRef = useRef();
  const [notif, setNotif] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [categoriesChooseOld, setCategoriesChooseOld] = useState([]);
  const [tag, setTag] = useState('');
  const [listTag, setListTag] = useState([]);
  const [categories, setCategories] = useState({});
  const [categoriesChoose, setCategoriesChoose] = useState([]);
  const [view, setView] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadPush, setLoadPush] = useState(false);
  const [method, setMethod] = useState(URL);
  const handleClickSave = () => {
    if (urlInputRef.current.value === '') {
      setNotif('Insert Picture. Use url string or upload file here');
      setOpenDialog(true);
      return;
    } else if (listTag.length === 0) {
      setNotif("Insert Tag. It's used as a kayword");
      setOpenDialog(true);
      return;
    } else if (categoriesChoose.length === 0) {
      setNotif("Choose a category, It's really necessary to categorize");
      setOpenDialog(true);
      return;
    } else if (view === '') {
      setNotif('Select the starting view (Recommended set 0)');
      setOpenDialog(true);
      return;
    } else {
      setNotif('');
    }
    setLoadPush(true);
    if (method === UPLOAD) {
      const file = fileInputRef.current.files[0];
      let toArray = file.name.split('.');
      let ext = toArray[toArray.length - 1];
      let offset = +7;
      let time = new Date(new Date().getTime() + offset * 3600 * 1000)
        .toUTCString()
        .replace(/ GMT$/, '');
      let image = storage.ref().child('wall/' + time + '.' + ext);
      image.put(file).then(() => {
        image.getDownloadURL().then(url => {
          urlInputRef.current.value = url;
          pushToDatabase(url);
        });
      });
    } else {
      pushToDatabase(urlInputRef.current.value);
    }
  };
  const handleFN = () => {
    setLoadPush(false);
    setNotif('Save successfully!');
    setOpenDialog(true);
  };
  const pushToDatabase = url => {
    if (id) {
      let picture = database.ref('Picture').child(id);
      picture.update(
        {
          mCategory: categoriesChoose,
          mKeyWord: listTag,
          mType: 0,
          mUrl: url,
          mView: parseInt(view),
          mTime: firebase.database.ServerValue.TIMESTAMP
        },
        e => {
          if (!e) {
            let removed = 0;
            for (const category in categoriesChooseOld) {
              database
                .ref('PictureToCategory')
                .child(categoriesChooseOld[category])
                .once('value')
                .then(snapshot => {
                  snapshot.forEach(snapshotChild => {
                    if (snapshotChild.val() === id) {
                      snapshotChild.getRef().remove();
                      if (removed === categoriesChooseOld.length - 1) {
                        for (const category2 in categoriesChoose) {
                          database
                            .ref('PictureToCategory')
                            .child(categoriesChoose[category2])
                            .push(picture.key, e => {
                              if (
                                !e &&
                                parseInt(category2) ===
                                  categoriesChoose.length - 1
                              ) {
                                handleFN();
                              }
                            });
                        }
                        removed = 0;
                        setCategoriesChooseOld(categoriesChoose);
                        return;
                      }
                      removed++;
                    }
                  });
                });
            }
          }
        }
      );
    } else {
      let picture = database.ref('Picture').push(
        {
          mCategory: categoriesChoose,
          mKeyWord: listTag,
          mType: 0,
          mUrl: url,
          mView: parseInt(view),
          mTime: firebase.database.ServerValue.TIMESTAMP
        },
        e => {
          if (!e) {
            for (const category in categoriesChoose) {
              database
                .ref('PictureToCategory')
                .child(categoriesChoose[category])
                .push(picture.key, e => {
                  if (
                    !e &&
                    parseInt(category) === categoriesChoose.length - 1
                  ) {
                    setListTag([]);
                    setCategoriesChoose([]);
                    setView(0);
                    setMethod(URL);
                    tagInputRef.current.value = '';
                    setTag('');
                    urlInputRef.current.value = '';
                    handleFN();
                  }
                });
            }
          }
        }
      );
    }
  };
  const handleChangeView = event => {
    setView(event.target.value);
  };
  const handleClickUpload = () => {
    fileInputRef.current.click();
  };
  const handleClickTag = () => {
    if (tagInputRef.current.value !== '') {
      listTag.indexOf(tag) === -1 && setListTag([...listTag, tag]);
      tagInputRef.current.value = '';
      setTag('');
    }
  };
  const handleClickDeleteTag = value => {
    setListTag([...listTag].filter(va => value !== va));
  };
  const handleChangeTag = event => {
    setTag(event.target.value);
  };
  const handleChangeCategories = event => {
    if (
      categoriesChoose.indexOf(event.target.name) === -1 &&
      event.target.checked
    ) {
      setCategoriesChoose([...categoriesChoose, event.target.name]);
    } else {
      setCategoriesChoose(
        [...categoriesChoose].filter(value => value !== event.target.name)
      );
    }
  };
  useEffect(() => {
    database
      .ref('Category')
      .once('value')
      .then(snapshot => {
        setCategories(snapshot.toJSON());
        if (id) {
          database
            .ref('Picture')
            .child(id)
            .once('value')
            .then(snapshotPicture => {
              setLoading(false);
              setCategoriesChooseOld(
                snapshotPicture.val().mCategory
                  ? Object.values(snapshotPicture.val().mCategory)
                  : []
              );
              setData(snapshotPicture.val());
            });
        } else {
          setLoading(false);
        }
      });
  }, []);
  const setData = data => {
    setMethod(URL);
    setListTag(data.mKeyWord ? Object.values(data.mKeyWord) : []);
    setCategoriesChoose(data.mCategory ? Object.values(data.mCategory) : []);
    setView(data.mView);
    setTag('');
    tagInputRef.current.value = '';
    urlInputRef.current.value = data.mUrl;
  };
  const handleChange = () => {
    setMethod(method === URL ? UPLOAD : URL);
  };
  const handleClose = () => {
    setOpenDialog(false);
  };
  return (
    <div className={classes.root}>
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{'Warning'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {notif}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      {loadPush && <LinearProgress style={{ marginBottom: 20 }} />}
      {loading ? (
        <LinearProgress />
      ) : (
        <Grid container spacing={4}>
          <Grid item lg={8} sm={8} xl={8} xs={12}>
            <Card>
              <CardHeader
                action={
                  <Button size="small" variant="text">
                    Detail <ArrowDropDownIcon />
                  </Button>
                }
                title="Add new Photo"
              />
              <Divider />
              <CardContent>
                <div className={classes.container}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Method</FormLabel>
                    <RadioGroup
                      row
                      aria-label="method-upload"
                      name="method-upload"
                      value={method}
                      onChange={handleChange}>
                      <FormControlLabel
                        value={URL}
                        control={<Radio />}
                        label="Url"
                      />
                      <FormControlLabel
                        value={UPLOAD}
                        control={<Radio />}
                        label="Upload File"
                      />
                    </RadioGroup>
                  </FormControl>
                  <FormControl fullWidth>
                    <TextField
                      inputRef={urlInputRef}
                      disabled={method === UPLOAD}
                      label="Url"
                      variant="outlined"
                    />
                  </FormControl>
                  <input
                    onChange={() => {
                      urlInputRef.current.value =
                        '       ' + fileInputRef.current.files[0].name;
                    }}
                    type="file"
                    ref={fileInputRef}
                    accept="image/png, image/jpeg, image/jpg"
                    hidden
                  />
                  {method === UPLOAD && (
                    <FormControl fullWidth className={classes.margin}>
                      <Button
                        onClick={handleClickUpload}
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        startIcon={<CloudUploadIcon />}>
                        Upload
                      </Button>
                    </FormControl>
                  )}
                  <FormControl className={classes.margin}>
                    <FormLabel component="legend">Categories</FormLabel>
                    <FormGroup>
                      {Object.keys(categories).map(id => {
                        return (
                          <FormControlLabel
                            key={id}
                            control={
                              <Checkbox
                                checked={categoriesChoose.indexOf(id) !== -1}
                                size="small"
                                name={id}
                                onChange={handleChangeCategories}
                              />
                            }
                            label={categories[id].mName}
                          />
                        );
                      })}
                    </FormGroup>
                  </FormControl>
                  <FormControl className={classes.margin} fullWidth>
                    <TextField
                      onChange={handleChangeTag}
                      label="Tag"
                      variant="outlined"
                      inputRef={tagInputRef}
                      InputProps={{
                        endAdornment: (
                          <Button color="primary" onClick={handleClickTag}>
                            Primary
                          </Button>
                        )
                      }}
                    />
                    <div>
                      {listTag.map((value, index) => {
                        return (
                          <span
                            key={index}
                            style={{
                              display: 'inline-flex',
                              padding: '5px 10px',
                              background: '#ececec',
                              borderRadius: '10px',
                              margin: '10px',
                              marginLeft: '0px'
                            }}>
                            <span>{value}</span>
                            <IconButton
                              style={{ padding: 0 }}
                              onClick={() => {
                                handleClickDeleteTag(value);
                              }}>
                              <ClearIcon size="10" style={{ fontSize: 20 }} />
                            </IconButton>
                          </span>
                        );
                      })}
                    </div>
                  </FormControl>
                  <FormControl fullWidth className={classes.margin}>
                    <TextField
                      value={view}
                      onChange={handleChangeView}
                      label="View Default"
                      variant="outlined"
                      InputProps={{ type: 'number' }}
                    />
                  </FormControl>
                </div>
              </CardContent>
              <Divider />
              <CardActions className={classes.actions}>
                <Button
                  color="primary"
                  variant="contained"
                  size="small"
                  onClick={handleClickSave}>
                  Save <SaveIcon fontSize="small" />
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default PictureAction;
