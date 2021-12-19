import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { LinearProgress, Button } from '@material-ui/core';
import { database } from '../../firebase';
const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
    textAlign: 'center'
  },
  button: { padding: 100, margin: 100 }
}));
const RefreshData = () => {
  const [refresh, setRefresh] = useState(false);
  const classes = useStyles();
  const handleClickRefresh = () => {
    setRefresh(true);
    const PictureToCategory = database.ref('PictureToCategory');
    PictureToCategory.set({});
    database
      .ref('Picture')
      .once('value')
      .then(snapshot => {
        snapshot.forEach(childSnapshot => {
          childSnapshot.val().mCategory.forEach(category => {
            PictureToCategory.child(category).push(childSnapshot.key);
          });
          setRefresh(false);
        });
      });
  };
  return (
    <div className={classes.root}>
      {refresh && <LinearProgress />}
      <Button
        onClick={handleClickRefresh}
        disabled={refresh}
        className={classes.button}
        variant="contained"
        color="primary">
        Refresh Data
      </Button>
    </div>
  );
};

export default RefreshData;
