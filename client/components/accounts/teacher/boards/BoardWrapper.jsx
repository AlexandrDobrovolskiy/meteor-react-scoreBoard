import React, { Component } from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import *  as constants from '../../../../constants/boards'
import Link from '../../../Link';
import ThCell from './ThCell'
import TdCell from './TdCell'
import { 
    Table,
    Input,
    Icon,
    Button,
    Badge
} from 'react-materialize'
import {
    ContextMenu, 
    MenuItem, 
    ContextMenuTrigger } from "react-contextmenu";
import { CirclePicker } from 'react-color'

export default class BoardWrapper extends TrackerReact(Component) {
    constructor(props){
        super(props);

        this.state = {
            subscriptions: {
                board: Meteor.subscribe('board', this.props.board)
            },
            editedHeaders: [],
            editedCells: []
        }

        this.handleNewColumn = this.handleNewColumn.bind(this);
        this.handleHeaderChange = this.handleHeaderChange.bind(this);
        this.handleUpdateHeaderCaption = this.handleUpdateHeaderCaption.bind(this);
        this.handleUpdateScore = this.handleUpdateScore.bind(this);
        this.autoSaveHeader = this.autoSaveHeader.bind(this);
        this.autoSaveRow = this.autoSaveRow.bind(this);

    }

    handleNewColumn(event){
        const { board } = this.props;
        Meteor.call('updateBoardNewColumn', {id: board});
        
        event.preventDefault();
    }

    handleHeaderChange = (index) => (event, value) => {
            this.autoSaveHeader(index, value, 'date');

            event.preventDefault();
        }

    handleUpdateScore = (rIndex, cIndex) => (event, value) => {
        this.autoSaveRow(rIndex, cIndex, value, 'score');

        event.preventDefault();
    }

    autoSaveRow = (rIndex, cIndex, value, call) => {
        Meteor.call('updateBoardRow', {
            id: this.props.board,
            call,
            rIndex,
            cIndex,
            value
        })
    }
    
    autoSaveHeader = (index, value, call) => {
        Meteor.call('updateBoardHeader', {
            id: this.props.board,
            call,
            index,
            value
        })
    }

    handleUpdateHeaderCaption = (index) => (event, value) => {
            this.autoSaveHeader(index, value, 'caption')

            event.preventDefault();
        }
    


    markColumn = (index) => (color, event) => {
        Meteor.call('updateBoardMarkColumn', {
            id: this.props.board,
            index,
            color: color.hex
        });

        event.preventDefault();
    }
    

    markCell = (rIndex, cIndex) => (color, event) => {
        this.autoSaveRow(rIndex, cIndex, color.hex, 'mark');

        event.preventDefault();
    }
    
    board = () => Boards.findOne(this.props.board);

    componentWillUnmount = () => {
      this.state.subscriptions.board.stop();
    }

    render() {

        if(!this.board()) return 'l'

      return (
        <div>
        <Table hoverable bordered>
            <thead>
                <tr>
                    <th className='name-td'>
                      Name
                    </th>
                    {this.board().header.map((item , index) => 
                    <th key={index}>
                        <ThCell 
                            caption={item.caption}
                            value={new Date(item.date).toLocaleDateString()} 
                            onChange={this.handleHeaderChange(index)} 
                            onChangeCaption={this.handleUpdateHeaderCaption(index)}
                        />
                    </th>)
                    }
                    <th>
                      <div onClick={this.handleNewColumn}>
                        <Icon>add</Icon>
                      </div>
                    </th>
                    <th>Average</th>
                    <th>Sum</th>
                </tr>
            </thead>
            <tbody>
                {
                this.board().rows.map((row, rIndex) => 
                    <tr key={rIndex}>
                        <td className='name-td'><Link to={'/student/' + row.userId}><Badge>{rIndex + 1}</Badge>{row.name}</Link></td>
                        {row.scores.map((item, cIndex) => 
                            <td key={`${rIndex}_${cIndex}`}> 
                                <TdCell  
                                    value={item.value.toString()}
                                    edited={this.state.editedCells.includes(`${rIndex}_${cIndex}`)} 
                                    onChange={this.handleUpdateScore(rIndex, cIndex)}
                                />
                            </td>)
                        }
                        <td> </td>
                        <td>{lodash.ceil(row.avg, 2) || 'not scored'}</td>
                        <td>{lodash.ceil(row.sum, 2) || 'not scored'}</td>
                    </tr>
                )
                }
            </tbody>
        </Table>
        <Button floating fab='vertical' faicon='fa fa-plus' icon='mode_edit' className='red' large style={{bottom: '45px', right: '24px'}}>
          <Button floating icon='save' onClick={this.handleSave} className='blue'/>
          <Button floating icon='file_download' className='green darken-1'/>
          <Button floating icon='group_add' className='yellow'/>
          <Button floating icon='attach_file' className='blue'/>
        </Button>
        </div>
      )
    }
}
