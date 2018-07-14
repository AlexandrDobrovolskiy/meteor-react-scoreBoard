import React, { Component } from 'react';
import { 
    Button,
    Collection,
    CollectionItem,
    Collapsible, 
    CollapsibleItem, 
    Row, 
    Col,
    Preloader 
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
        <h4>Groups <span className="right align">{this.groups().length}</span></h4>
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
            <Preloader size='big' flashing active={!this.groups()}/>
            <Collapsible popout accordion >
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
                        Disciplines
                        {
                            group.disciplines.length > 0 ?
                            <Collection>
                                {group.disciplines.map((discipline, index) => 
                                    <CollectionItem key={index}>{!!this.subject(discipline._id) && this.subject(discipline._id).name}</CollectionItem>
                                )}
                            </Collection>
                            : 
                            <p>There are no disciplines yet.</p>
                        }
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
