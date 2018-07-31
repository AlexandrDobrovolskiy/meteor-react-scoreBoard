import React, { Component } from 'react'
import ReactPlaceholder from 'react-placeholder';
import "react-placeholder/lib/reactPlaceholder.css";
import TrackerReact from 'meteor/ultimatejs:tracker-react';

const Preloader = () => 
  <ReactPlaceholder showLoadingAnimation rows={1} type='text' ready={false}>
      <h1>Make some awesome here</h1>
  </ReactPlaceholder>

export default class TeacherProfile extends  TrackerReact(Component) {
  constructor(){
    super()

  }
  
  
  render() {
    const user = Meteor.user();

    if(!user) return <Preloader />

    console.log(user);

    return (
      <div className="container flow-text">
        <div><h6 className='right'>{user.profile.name}</h6></div>
        <p>Hello</p>
      </div>
    )
  }
}
