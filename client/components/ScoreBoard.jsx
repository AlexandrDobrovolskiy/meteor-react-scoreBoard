import React, { Component } from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import 'react-table/react-table.css'
import {
    Preloader,
    Breadcrumb,
    MenuItem,
    Table,
    Input,
    Button,
    Tabs,
    Tab
} from 'react-materialize'
import BoardWrapper from './BoardWrapper';

Boards = new Mongo.Collection('boards');

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
            newBoardName: ''
        }

        this.handleCreate = this.handleCreate.bind(this);
    }


    handleCreate(e){
        const groupId = this.group()._id;
        const subjectId = this.subject()._id;
        const name = this.refs.newBoardName.input.value.trim();

        Meteor.call('createBoard', {
            groupId,
            subjectId,
            name
        }, (err, res) => {
            console.log(err);
            console.log(res);
        });

        e.preventDefault();
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

    ready = () => !!this.group() && !!this.boards() && !!this.subject()

    render() {

        if(!this.group() && !this.boards() && !this.subject()) return 'loading'

        return (
            <Tabs className='sb-tabs' key={'tabs' + new Date().toDateString()}>
                {
                    this.boards().map(b => 
                        <Tab className='sb-tab' title={b.name} key={b._id + new Date()}>
                            <BoardWrapper board={b} key={b._id} />
                        </Tab>
                    )
                }
                <Tab 
                    className='sb-create-tab'
                    id='create'
                    title={
                        <Input 
                            type='text' 
                            label='Create board'
                            ref="newBoardName" 
                        />
                    }
                >
                    <div
                        className='sb-create-content'
                    >
                        Create new board =)
                        <Button onClick={this.handleCreate}> Create </Button>
                    </div>
                </Tab>
            </Tabs>
        )
    }
}
