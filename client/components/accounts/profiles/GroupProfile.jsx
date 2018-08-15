import React, { Component, Fragment } from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react';

export default class GroupProfile extends TrackerReact(Component) {
    constructor(props){
        super(props);
        const { id } = this.props;
        this.state = {
            subscriptions: {
                group: Meteor.subscribe('group', id),
                boards: Meteor.subscribe('groupBoards', id),
            }
        }
    }

    //Returns the group object from db
    group = () => Groups.findOne(this.props.id);

    //Returns the board object from db
    boards = () => Boards.find({groupId: this.props.id}).fetch();

    //Check the data is ready
    ready = () => !!this.group() && !!this.boards(); 

    render() {

      if(!this.ready()){

        return 'Loading'
      }

      console.log(this.boards(), this.group());

      return (
        <div className='container'>
          {this.group().name}
          {this.boards().map(board => board.name)}
        </div>
      )
    }
}
