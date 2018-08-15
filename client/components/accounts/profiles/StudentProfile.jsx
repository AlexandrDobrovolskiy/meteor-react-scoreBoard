import React, { Component } from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import { LineChart } from 'react-easy-chart'
import './style.css'

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

    //Returns the user object from db
    user(){
      return Meteor.users.findOne(this.state.id);
    }

    //Returns the student object from db
    student(){
      return Students.findOne({userId: this.state.id});
    }

  render() {
    const ready = !!this.student() && !!this.user();

    if(!ready) return 'loading'

    console.log(this.student(), this.user())

    return (
      <div className="container">

        {/*Progress chart (now the values are updating randomly each 15 seconds) */}
        <LineChart
          xType={'text'}
          axes
          width={750}
          height={250}
          data={[
            this.student().progress.map((p, index) => ({x: index, y: _.random(60, 100)}))
          ]}
        />
      </div>
    )
  }
}
