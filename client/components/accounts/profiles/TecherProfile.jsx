import React, { Component } from 'react'
import ReactPlaceholder from 'react-placeholder';
import "react-placeholder/lib/reactPlaceholder.css";
import TrackerReact from 'meteor/ultimatejs:tracker-react';

export default class TeacherProfile extends  TrackerReact(Component) {
  render() {
    return (
      <div id="container">
        <ReactPlaceholder showLoadingAnimation rows={1} type='text' ready={false}>
            <h1>Hello {!!Meteor.user() && Meteor.user().profile.name}</h1>
        </ReactPlaceholder>
      </div>
    )
  }
}
