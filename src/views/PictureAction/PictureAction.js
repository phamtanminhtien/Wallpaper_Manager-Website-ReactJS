import React, { useState, useEffect } from 'react';
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
  IconButton
} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import ClearIcon from '@material-ui/icons/Clear';
import { database } from '../../firebase';
const [URL, UPLOAD] = [0, 1];
const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  margin: {
    paddingTop: theme.spacing(1)
  },
  container: {
    position: 'relative'
  },
  actions: {
    justifyContent: 'flex-end'
  }
}));

const PictureAction = () => {
  const classes = useStyles();
  const [tag, setTag] = useState('');
  const [listTag, setListTag] = useState([]);
  const [categories, setCategories] = useState({});
  const [categoriesChoose, setCategoriesChoose] = useState([]);
  const handleClickTag = () => {
    listTag.indexOf(tag) === -1 && setListTag([...listTag, tag]);
  };
  const handleClickDeleteTag = value => {
    setListTag([...listTag].filter(va => value != va));
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
        [...categoriesChoose].filter(value => value != event.target.name)
      );
    }
  };
  const [method, setMethod] = useState(URL);
  useEffect(() => {
    database
      .ref('Category')
      .once('value')
      .then(snapshot => {
        setCategories(snapshot.toJSON());
      })
      .catch(err => {
        console.error(err);
      });
  }, []);
  const handleChange = () => {
    setMethod(method == URL ? UPLOAD : URL);
  };
  return (
    <div className={classes.root}>
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
                    disabled={method == UPLOAD}
                    id="outlined-basic"
                    label="Url"
                    variant="outlined"
                  />
                </FormControl>
                {method == UPLOAD && (
                  <FormControl className={classes.margin}>
                    <Button
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
                    id="outlined-basic"
                    label="Tag"
                    variant="outlined"
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
              </div>
            </CardContent>
            <Divider />
            <CardActions className={classes.actions}>
              <Button color="primary" size="small" variant="text">
                Overview <ArrowRightIcon />
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default PictureAction;
