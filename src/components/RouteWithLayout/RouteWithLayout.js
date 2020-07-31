import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { UserContext } from '../../UserProvider';

const RouteWithLayout = props => {
  const { layout: Layout, component: Component, ...rest } = props;

  return (
    <Route
      {...rest}
      render={matchProps => (
        <UserContext.Consumer>
          {context => {
            if (context.loaded) {
              if (!context.user) {
                return (
                  <Redirect
                    to={{
                      pathname: '/sign-in'
                    }}
                  />
                );
              } else {
                return (
                  <Layout>
                    <Component {...matchProps} />
                  </Layout>
                );
              }
            }
          }}
        </UserContext.Consumer>
      )}
    />
  );
};

RouteWithLayout.propTypes = {
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
  path: PropTypes.string
};

export default RouteWithLayout;
