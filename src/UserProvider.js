import React, { Component, createContext } from 'react';
import { auth } from './firebase';

const UserContext = createContext();
class UserProvider extends Component {
  state = {
    user: null,
    loaded: false
  };

  componentDidMount = () => {
    auth.onAuthStateChanged(userAuth => {
      this.setState({ user: userAuth, loaded: true });
    });
  };
  render() {
    return (
      <UserContext.Provider
        value={{ user: this.state.user, loaded: this.state.loaded }}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}

export { UserContext };
export default UserProvider;
