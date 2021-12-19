import React from 'react';
import { Switch, Redirect } from 'react-router-dom';

import {
  RouteWithLayout,
  RouteWithLayoutPublic,
  RouteWithLayoutAuth
} from './components';
import { Main as MainLayout, Minimal as MinimalLayout } from './layouts';

import {
  Dashboard as DashboardView,
  UserList as UserListView,
  SignIn as SignInView,
  NotFound as NotFoundView,
  PictureList as PictureListView,
  CategoryList as CategoryListView,
  PictureAction as PictureActionView,
  RefreshData as RefreshDataView,
  CategoryAction as CategoryActionView,
  Extra as ExtraView
} from './views';

const Routes = () => {
  return (
    <Switch>
      <Redirect exact from="/" to="/dashboard" />
      <RouteWithLayout
        component={DashboardView}
        exact
        layout={MainLayout}
        path="/dashboard"
      />
      <RouteWithLayout
        component={PictureListView}
        exact
        layout={MainLayout}
        path="/picture-list"
      />
      <RouteWithLayout
        component={PictureActionView}
        exact
        layout={MainLayout}
        path="/picture"
      />
      <RouteWithLayout
        component={PictureActionView}
        exact
        layout={MainLayout}
        path="/picture/:id"
      />
      <RouteWithLayout
        component={CategoryListView}
        exact
        layout={MainLayout}
        path="/category-list"
      />
      <RouteWithLayout
        component={CategoryActionView}
        exact
        layout={MainLayout}
        path="/category"
      />
      <RouteWithLayout
        component={CategoryActionView}
        exact
        layout={MainLayout}
        path="/category/:id"
      />
      <RouteWithLayout
        component={ExtraView}
        exact
        layout={MainLayout}
        path="/extra"
      />
      <RouteWithLayout
        component={CategoryActionView}
        exact
        layout={MainLayout}
        path="/category"
      />
      <RouteWithLayout
        component={RefreshDataView}
        exact
        layout={MainLayout}
        path="/refresh-data"
      />
      <RouteWithLayout
        component={UserListView}
        exact
        layout={MainLayout}
        path="/users"
      />
      <RouteWithLayoutAuth
        component={SignInView}
        exact
        layout={MinimalLayout}
        path="/sign-in"
      />
      <RouteWithLayoutPublic
        component={NotFoundView}
        exact
        layout={MinimalLayout}
        path="/not-found"
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default Routes;
