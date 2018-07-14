import React, { Component } from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react';

export default class StudentProfile extends TrackerReact(Component) {
    constructor(props){
        super(props);

        this.state = {
            user: null,
        }
    }

    componentDidMount(){
        this.setState({user: Meteor.user()});
    }

  render() {
    return (
      <div id="container">
        <h5>Hello, stupid {!!Meteor.user() && Meteor.user().profile.name}.</h5>
      </div>
    )
  }
}
