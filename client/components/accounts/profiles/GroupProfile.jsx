import React, { Component } from 'react'
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

    group = () => Groups.findOne(this.props.id);

    boards = () => Boards.find({groupId: this.props.id}).fetch();

    ready = () => !!this.group() && !!this.boards(); 

    render() {
      if(!this.ready()){
        return 'Loading'
      }
      console.log(this.boards());
      return (
        <div>
          {this.group().name}
          {this.boards().map(board => board.name)}
        </div>
      )
    }
}
