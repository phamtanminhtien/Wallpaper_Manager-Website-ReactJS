import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  IconButton,
  Grid,
  Typography,
  LinearProgress
} from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { database } from '../../firebase';
import PictureCard from './components/PictureCard';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  },
  pagination: {
    marginTop: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
  }
}));

const PictureList = () => {
  const classes = useStyles();

  const [pictures, setPictures] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    database
      .ref('Picture')
      .once('value')
      .then(snapshot => {
        setPictures(snapshot.toJSON());
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);
  return (
    <div className={classes.root}>
      {loading && <LinearProgress />}
      <div className={classes.content}>
        <Grid container spacing={3}>
          {Object.keys(pictures).map(product => (
            <Grid item key={product} lg={2} md={4} xs={6}>
              <PictureCard
                idp={product}
                data={pictures[product]}
                product={{}}
              />
            </Grid>
          ))}
        </Grid>
      </div>
      <div className={classes.pagination}>
        <Typography variant="caption">1-6 of 20</Typography>
        <IconButton>
          <ChevronLeftIcon />
        </IconButton>
        <IconButton>
          <ChevronRightIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default PictureList;
