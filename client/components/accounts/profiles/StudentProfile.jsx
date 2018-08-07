import React, { Component } from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { LineChart } from 'react-easy-chart';

Students = new Mongo.Collection('students');

export default class StudentProfile extends TrackerReact(Component) {
    constructor(props){
        super(props);

        const {id} = this.props;

        this.state = {
          subscriptions: {
            user: Meteor.subscribe('user', id),
            student: Meteor.subscribe('student', id)
          },
          id
        }
    }

    user(){
      return Meteor.users.findOne(this.state.id);
    }

    student(){
      return Students.findOne({userId: this.state.id});
    }

  render() {
    const ready = !!this.student() && !!this.user();

    if(!ready) return 'loading'

    return (
      <div id="container">
        <h5>{this.user().profile.name}.</h5>
        <LineChart
          xType={'text'}
          axes
          width={750}
          height={250}
          data={[
            this.student().progress.map((p, index) => ({x: index/*new Date(p.date).getMonth() + '-' + new Date(p.date).getDay()*/, y: _.random(60, 100)/*parseInt(p.score)*/}))
          ]}
        />
      </div>
    )
  }
}
