import React, { useState } from 'react';
import DND from './components/DND';
import {
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Button,
  LinearProgress
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  actions: {
    justifyContent: 'flex-end'
  }
}));
const Extra = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const handleClickOpen = () => {
    setOpenDialog(true);
  };
  const onClickSave = () => {
    setLoading(true);
  };
  const onFinishSave = () => {
    setLoading(false);
    handleClickOpen();
  };
  const handleClose = () => {
    setOpenDialog(false);
  };
  return (
    <div className={classes.root}>
      {loading ? (
        <LinearProgress />
      ) : (
        <Grid container spacing={4}>
          <DND
            name="Hot"
            onClickSave={onClickSave}
            onFinishSave={onFinishSave}
          />
          <DND
            name="Tabs"
            onClickSave={onClickSave}
            onFinishSave={onFinishSave}
          />
          <DND
            name="Slide"
            onClickSave={onClickSave}
            onFinishSave={onFinishSave}
          />
        </Grid>
      )}
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{'Notification'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {'Save successfully!'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default Extra;
