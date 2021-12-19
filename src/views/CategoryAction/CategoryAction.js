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

const CategoryAction = () => {
  const { id } = useParams();
  const classes = useStyles();
  const tagInputRef = useRef();
  const nameInputRef = useRef();
  const fileInputRef = useRef();
  const urlInputRef = useRef();
  const [notif, setNotif] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [tag, setTag] = useState('');
  const [listTag, setListTag] = useState([]);
  const [view, setView] = useState(0);
  const [loading, setLoading] = useState(false);
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
    } else if (nameInputRef.current.value === '') {
      setNotif('Please enter the category name');
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
      let image = storage.ref().child('wall/categories/' + time + '.' + ext);
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
      database
        .ref('Category')
        .child(id)
        .update(
          {
            mName: nameInputRef.current.value,
            mKeyWord: listTag,
            mUrl: url,
            mView: parseInt(view),
            mTime: firebase.database.ServerValue.TIMESTAMP
          },
          e => {
            if (!e) {
              handleFN();
            }
          }
        );
    } else {
      database.ref('Category').push(
        {
          mName: nameInputRef.current.value,
          mKeyWord: listTag,
          mUrl: url,
          mView: parseInt(view),
          mTime: firebase.database.ServerValue.TIMESTAMP
        },
        e => {
          if (!e) {
            setListTag([]);
            setTag('');
            setView(0);
            setMethod(URL);
            urlInputRef.current.value = '';
            tagInputRef.current.value = '';
            nameInputRef.current.value = '';
            handleFN();
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
  useEffect(() => {
    if (id) {
      setLoading(true);
      database
        .ref('Category')
        .child(id)
        .once('value')
        .then(snapshot => {
          setLoading(false);
          setData(snapshot.val());
        });
    }
  }, [id]);
  const setData = data => {
    setMethod(URL);
    setListTag(data.mKeyWord ? Object.values(data.mKeyWord) : []);
    setView(data.mView);
    setTag('');
    nameInputRef.current.value = data.mName;
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
      {loadPush && <LinearProgress />}
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
                  <FormControl fullWidth className={classes.margin}>
                    <TextField
                      inputRef={nameInputRef}
                      label="Name"
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

export default CategoryAction;
