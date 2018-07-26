import React, { Component } from 'react';
import { 
    Button,
    Collection,
    CollectionItem,
    Collapsible, 
    CollapsibleItem, 
    Row, 
    Col,
    Preloader,
    Badge 
} from 'react-materialize';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

Groups = new Mongo.Collection('groups');

export default class GroupsWrapper extends TrackerReact(Component) {
    constructor(){
        super();
        
        this.state = {
            subscription: {
                groups: Meteor.subscribe('allGroups'),
                disciplines: Meteor.subscribe('allSubjects')
            }
        }

        this.addGroup = this.addGroup.bind(this);
    }

    groups(){
        return Groups.find({}, { sort: [['name', 'asc']] }).fetch();
    }

    subject(id){
        return Subjects.findOne(id);
    }

    addGroup(event){
        Meteor.call('addGroup', this.refs.newGroup.value.trim());
        event.preventDefault();
    }

    componentWillUnmount(){
        this.state.subscription.groups.stop();
    }

  render() {
    return (
      <div className="container">
            <Preloader size='big' flashing active={!this.groups()}/>
            <Collapsible popout accordion >
            <CollapsibleItem
                header={
                    <span>
                        Add new Group
                    </span>} 
                icon='add'
            >
            <form onSubmit={this.addGroup.bind(this)}>
                <Row s={12}>
                    <Col s={10}>
                        <input 
                            type="text"
                            ref="newGroup"
                            placeholder="New Group"
                        />
                    </Col>
                    <Col>
                        <Button 
                            waves='light'
                            className="right"   
                            type='submit'
                        >
                            Add Group
                        </Button>
                    </Col>
                </Row>
            </form>
            </CollapsibleItem>
            {!!this.groups() && this.groups().map((group, index) => {
                return (
                    <CollapsibleItem 
                        key={index}
                        header={
                            <span>
                                {group.name}
                                <Badge>
                                    Students: {group.students.length}, 
                                    Disciplines: {group.disciplines.length}
                                </Badge>
                            </span>} 
                        icon='group'
                    >
                    <Row s={12}>
                        <Col s={4}>
                        <a href={`group/${group._id}`}>View group Profile</a>
                        </Col>
                    </Row>
                    </CollapsibleItem>
                )
            })}
            </Collapsible>
      </div>
    )
  }
}
