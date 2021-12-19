import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardMedia,
  Typography,
  Grid,
  Divider,
} from '@material-ui/core';
import TitleIcon from '@material-ui/icons/Title';
import CreateTimeIcon from '@material-ui/icons/Create';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    '&:hover': {
      transform: 'scale(1.01) translateY(-7px) translateX(6px)',
      cursor: 'pointer',
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
    paddingTop: '56%' // 16:9
  }
}));

const PictureCard = props => {
  const { className, data, idc, ...rest } = props;

  const classes = useStyles();

  return (
    <Link to={{ pathname: '/category/' + idc }}>
      <Card {...rest} className={clsx(classes.root, className)}>
        <CardMedia className={classes.media} image={data.mUrl} />
        <Divider />
        <CardActions>
          <Grid container justify="space-between">
            <Grid className={classes.statsItem} item>
              <TitleIcon className={classes.statsIcon} />
              <Typography display="inline" variant="body2">
                {data.mName}
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
      </Card>
    </Link>
  );
};

PictureCard.propTypes = {
  className: PropTypes.string,
  data: PropTypes.object.isRequired,
  idc: PropTypes.string.isRequired
};

export default PictureCard;
