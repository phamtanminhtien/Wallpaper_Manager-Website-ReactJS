import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Divider, Drawer } from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PictureIcon from '@material-ui/icons/Collections';
import PeopleIcon from '@material-ui/icons/People';
import CategoryIcon from '@material-ui/icons/Category';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import ColorizeIcon from '@material-ui/icons/Colorize';

import { Profile, SidebarNav } from './components';

const useStyles = makeStyles(theme => ({
  drawer: {
    width: 240,
    [theme.breakpoints.up('lg')]: {
      marginTop: 64,
      height: 'calc(100% - 64px)'
    }
  },
  root: {
    backgroundColor: theme.palette.white,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2)
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  nav: {
    marginBottom: theme.spacing(2)
  }
}));

const Sidebar = props => {
  const { open, variant, onClose, className, ...rest } = props;

  const classes = useStyles();

  const pages = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: <DashboardIcon />
    },
    {
      title: 'Picture List',
      href: '/picture-list',
      icon: <PictureIcon />
    },
    {
      title: 'Add Picture',
      href: '/picture',
      icon: <AddPhotoAlternateIcon />
    },
    {
      title: 'Category List',
      href: '/category-list',
      icon: <CategoryIcon />
    },
    {
      title: 'Add Category',
      href: '/category',
      icon: <LibraryAddIcon />
    },
    {
      title: 'Extra',
      href: '/extra',
      icon: <ColorizeIcon />
    },
    {
      title: 'Refresh Data',
      href: '/refresh-data',
      icon: <AutorenewIcon />
    },
    {
      title: 'Users',
      href: '/users',
      icon: <PeopleIcon />
    }
  ];

  return (
    <Drawer
      anchor="left"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      variant={variant}>
      <div {...rest} className={clsx(classes.root, className)}>
        <Profile />
        <Divider className={classes.divider} />
        <SidebarNav className={classes.nav} pages={pages} />
      </div>
    </Drawer>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired
};

export default Sidebar;
