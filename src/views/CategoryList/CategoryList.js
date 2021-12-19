import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  Grid,
  LinearProgress
} from '@material-ui/core';
import { database } from '../../firebase';
import CategoryCard from './components/CategoryCard';

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

const CategoryList = () => {
  const classes = useStyles();

  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    database
      .ref('Category')
      .once('value')
      .then(snapshot => {
        setCategories(snapshot.toJSON());
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
          {Object.keys(categories).map(product => (
            <Grid item key={product} lg={3} md={4} xs={6}>
              <CategoryCard
                idc={product}
                data={categories[product]}
                product={{}}
              />
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default CategoryList;
