import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  IconButton,
  CardActions,
  CardMedia,
  CardHeader,
  Typography,
  Grid,
  Divider,
  Avatar
} from '@material-ui/core';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import CreateTimeIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link } from 'react-router-dom';
const useStyles = makeStyles(theme => ({
  root: {
    '&:hover': {
      transform: 'scale(1.01) translateY(-7px) translateX(6px)',
      boxShadow: '-4px 7px 20px 1px #b7b7b7'
    },
    transition: '0.3s'
  },
  content: { padding: 0 },
  imageContainer: {
    margin: '0 auto',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: '100%'
  },
  statsItem: {
    display: 'flex',
    alignItems: 'center'
  },
  statsIcon: {
    color: theme.palette.icon,
    marginRight: theme.spacing(1)
  },
  media: {
    height: 0,
    paddingTop: '140%' // 16:9
  }
}));

const PictureCard = props => {
  const { className, data, idp, onDelete, ...rest } = props;
  const getStringDate = timestamp => {
    let time = new Date(timestamp);
    let dd = time.getDate();

    let mm = time.getMonth() + 1;
    let yyyy = time.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }

    if (mm < 10) {
      mm = '0' + mm;
    }
    return dd + '-' + mm + '-' + yyyy;
  };
  const classes = useStyles();
  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardHeader
        avatar={
          <Avatar
            aria-label="recipe"
            className={classes.avatar}
            src="/images/avatars/avatar_12.jpg"
          />
        }
        action={
          <IconButton
            aria-label="delete"
            onClick={() => {
              onDelete(idp, data.mCategory);
            }}>
            <DeleteIcon />
          </IconButton>
        }
        title="Minh Tien Uploaded"
        subheader="❤️ by me"
      />
      <Link to={{ pathname: '/picture/' + idp }}>
        <CardMedia className={classes.media} image={data.mUrl} />
        <Divider />
        <CardActions>
          <Grid container justify="space-between">
            <Grid className={classes.statsItem} item>
              <AccessTimeIcon className={classes.statsIcon} />
              <Typography display="inline" variant="body2">
                {data.mTime ? getStringDate(data.mTime) : 'Updated ... ago'}
              </Typography>
            </Grid>
            <Grid className={classes.statsItem} item>
              <CreateTimeIcon className={classes.statsIcon} />
              <Typography display="inline" variant="body2">
                Edit
              </Typography>
            </Grid>
          </Grid>
        </CardActions>
      </Link>
    </Card>
  );
};

PictureCard.propTypes = {
  className: PropTypes.string,
  data: PropTypes.object.isRequired,
  idp: PropTypes.string.isRequired
};

export default PictureCard;
