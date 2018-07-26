import React, { Component } from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { 
    Row, 
    Collection,
    CollectionItem, 
    Button,
    Input,
    Icon,
    Col,
    Collapsible,
    CollapsibleItem,
    Badge 
} from 'react-materialize';



Subjects = new Mongo.Collection('subjects');

const updateByPropertyName = (propertyName, value) => () => ({
    [propertyName]: value,
});
 
export default class DisciplinesWrapper extends TrackerReact(Component) {
    constructor(props){
        super();

        this.state = {
            subscriptions: {
                subjects: Meteor.subscribe('allSubjects'),
                groups: Meteor.subscribe('allGroups')
            },
            relatedGroups: [],
            related: null
        }
    }

    addSubject(event){
        let relatedGroups = this.groups().filter((group, index) => {
            return this.state.relatedGroups.includes(index + '');
        }); 

        let newSubject = {
            name: this.refs.newSubject.state.value.trim(),
            groups: relatedGroups
        }

        Meteor.call('addSubject', newSubject, (err, res) => {
            console.log(err);
        });

        event.preventDefault();
    }

    subjects(){
        return Subjects.find({}).fetch();
    }

    groups(){
        return Groups.find({}).fetch(); 
    }

    getStudents(){

    }

    componentWillUnmount(){
        this.state.subscriptions.subjects.stop();
        this.state.subscriptions.groups.stop();
    }

    render() {
      return (
        <div className="container">
            <Collapsible popout accordion >
                <CollapsibleItem 
                    header={'Add new Discipline'}
                    icon={'add'} 
                >
                    <form onSubmit={this.addSubject.bind(this)}>
                        <Row s={12}>
                            <Input 
                                type="text"
                                ref="newSubject"
                                placeholder="New Discipline"
                                s={8}
                            />
                            <Button 
                                waves='light'
                                type='submit'
                                className="form-button"
                            >
                            Add Discipline
                            </Button>
                        </Row>
                        <Row>
                            <Input s={2} 
                                type='select'
                                onChange={event => this.setState(updateByPropertyName('related', event.target.value))}
                            > 
                                <option value={'default'}>Group</option>
                                {
                                    this.groups().map((group, index) => {
                                        return <option value={index} key={index}>{group.name}</option>
                                    })
                                }
                            </Input>
                            <Col className="form-button">
                                <a
                                    waves='light'
                                    className='blue lighten-2 btn waves-effect waves-light'
                                    disabled={!this.state.related || this.state.related === 'default'}
                                    onClick={() => {
                                        if(!this.state.relatedGroups.includes(this.state.related)){
                                            this.setState(({
                                            relatedGroups: [...this.state.relatedGroups, this.state.related]
                                            }));
                                        }
                                    }}
                                >
                                Relate Group
                                </a>
                            </Col>
                            <Col s={6}>
                                {   this.state.relatedGroups.length > 0 &&
                                <Collection>
                                {this.state.relatedGroups.map((group, index) => {
                                    return (
                                        <CollectionItem 
                                            onClick={() => {
                                                this.setState((
                                                    this.state.relatedGroups.splice(index, 1)
                                                ));
                                            }}
                                            key={index}
                                        >
                                        {this.groups()[group].name} 
                                        <Icon
                                            className="right"
                                        >
                                        delete
                                        </Icon>  
                                    </CollectionItem>
                                    )
                                })}
                                </Collection>
                                }
                            </Col>
                        </Row>
                    </form>
                </CollapsibleItem>
                {
                    this.subjects().map((subject, index) => {
                        return (
                            <CollapsibleItem 
                                key={index}
                                header={
                                    <span>
                                        {subject.name}
                                        <Badge>
                                            {subject.groups.length} groups, 
                                            {0 /*TODO*/} students 
                                        </Badge>
                                    </span>} 
                                icon='book'
                            >
                            </CollapsibleItem>
                        )
                    })
                }
            </Collapsible>
        </div>)
    }
}

