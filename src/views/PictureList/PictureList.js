import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  Grid,
  LinearProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Button
} from '@material-ui/core';
import { database } from '../../firebase';
import PictureCard from './components/PictureCard';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  },
  loadmore: {
    marginTop: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}));

const PictureList = () => {
  const perpage = 30;
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const [numChild, setNumChild] = useState(0);
  const [deleteID, setDeleteID] = useState('');
  const [deleteCAT, setDeleteCAT] = useState([]);
  const [pictures, setPictures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleOnDelete = (id, category) => {
    setDeleteCAT(category)
    setDeleteID(id);
    handleClickOpen();
  };
  const handleDelete = () => {
    for (const cat in deleteCAT) {
      database
        .ref('PictureToCategory')
        .child(deleteCAT[cat])
        .once('value')
        .then(snapshot => {
          snapshot.forEach(snapshotChild => {
            if (snapshotChild.val() === deleteID) {
              snapshotChild.getRef().remove();
            }
          });
        });
    }
    database
      .ref('Picture')
      .child(deleteID)
      .remove();
    handleClose();
  };
  useEffect(() => {
    database
      .ref('Picture')
      .orderByChild('mTime')
      .limitToLast(page * perpage)
      .on('value', snapshot => {
        setNumChild(snapshot.numChildren());
        let list = [];
        snapshot.forEach(child => {
          list.push({ ...child.val(), mID: child.key });
        });
        setPictures(list.reverse());
        setLoading(false);
      });
  }, [page]);
  return (
    <div className={classes.root}>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{'Warning!!!'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Photos that are permanently deleted cannot be restored. Are you sure
            you want to delete it?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Disagree
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      {loading && <LinearProgress />}
      <div className={classes.content}>
        <Grid container spacing={3}>
          {pictures.map(product => (
            <Grid item key={product.mID} lg={2} md={3} xs={6} xl={2}>
              <PictureCard
                onDelete={handleOnDelete}
                idp={product.mID}
                data={product}
                product={{}}
              />
            </Grid>
          ))}
        </Grid>
      </div>
      <div className={classes.loadmore}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            if ((page + 1) * perpage <= numChild + 3) {
              setPage(page + 1);
            }
          }}>
          Load More
        </Button>
      </div>
    </div>
  );
};

export default PictureList;
