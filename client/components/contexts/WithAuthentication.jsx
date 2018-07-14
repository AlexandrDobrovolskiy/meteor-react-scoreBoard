import React from 'react';

import AuthUserContext from './AuthUserContext';
import { Tracker } from 'meteor/tracker'

const withAuthentication = (Component) =>
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        authUser: Meteor.user(),
      };
    }

    componentDidMount() {
      this.setState({ authUser: Meteor.user()});
      Tracker.autorun(() => {
        this.setState(() => ({ authUser: Meteor.user() }));
      });
    }

    render() {
      return (
        <AuthUserContext.Provider value={this.state.authUser}>
          <Component />
        </AuthUserContext.Provider>
      );
    }
  };

export default withAuthentication;