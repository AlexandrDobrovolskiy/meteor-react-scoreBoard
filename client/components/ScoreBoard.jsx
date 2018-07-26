import React, { Component } from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import 'react-table/react-table.css'
import {
    Preloader,
    Breadcrumb,
    MenuItem,
    Table,
    Input,
    Button
} from 'react-materialize'

Boards = new Mongo.Collection('boards');

const updateByPropertyName = (propertyName, value) => () => ({
    [propertyName]: value,
});

const EditableCell = ({value}) => {
    return (
        <Input 
            type='text' 
            defaultValue={value}
            autoComplete={'off'}
            className={'table-input'}
        />
    )
}

const DateCell = ({value}) => 
    <Input 
        type='date'
        placeholder={value}
        className={'table-input'}
        onChange={function(e, value) {}} 
    />

export default class ScoreBoard extends TrackerReact(Component) {
    constructor(props){
        super(props);

        const {
            group,
            discipline
        } = this.props;

        this.state = {
            subscriptions: {
                group: Meteor.subscribe('group', group),
                discipline: Meteor.subscribe('subject', discipline),
                boards: Meteor.subscribe('boards', group, discipline)
            },
            scores: []
        }
    }

    componentWillMount = () => {
      this.setState({
          scores: this.scores()
      });
    }
    

    group = () => Groups.findOne(this.props.group);

    subject = () => Subjects.findOne(this.props.discipline);

    boards = () => Boards.find({}).fetch();

    componentWillUnmount = () => {
        const {subscriptions} = this.state; 

        subscriptions.group.stop();
        subscriptions.discipline.stop();
        subscriptions.boards.stop();
    }

    render() {
        if(!this.group()) return 'loading'
        return (
            <div>
                <Table hoverable>
                    <thead>
                        {this.boards()[0].header.map(item => <th>{item}</th>)}
                    </thead>
                    <tbody>
                        {this.boards()[0].rows.map(row => {
                            return <tr>{row.map(item => <td>{item}</td>)}</tr>
                        })}
                    </tbody>
                </Table>
            </div>
        )
    }
}
