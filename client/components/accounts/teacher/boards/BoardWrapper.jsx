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
            table: this.props.board,
            editedHeaders: [],
            editedCells: []
        }

        this.state.table.rows.sort((f, s) => {
            let fname = f.name.toUpperCase();
            let sname = s.name.toUpperCase();
            if(fname < sname){
                return -1;
            }
            if(fname > sname){
                return 1;
            }
            return 0;
        });


        this.handleNewColumn = this.handleNewColumn.bind(this);
        this.handleRowsChange = this.handleRowsChange.bind(this);
        this.handleHeaderChange = this.handleHeaderChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    handleNewColumn(event){
        const { table } = this.state;

        if(table.header.length < constants.MAX_COLUMNS){
            this.setState(prev => {
                prev.table.header.push({
                    date: new Date(),
                    caption: `lesson ${prev.table.header.length + 1}`
                });

                _.forEach(prev.table.rows, row => {
                    row.scores.push({
                        value: 0,
                        marked: false
                    })
                });
    
                return prev;
            }, this.handleSave);    
        }else{
            //TODO: nice toast with caption "No more columns allowed, you may create new board"
        }
        
        event.preventDefault();
    }

    handleHeaderChange(index){

        return (event, value) => {
            this.setState(prev => {
                prev.table.header[index].date = value;

                return prev;
            }, this.handleSave);

            event.preventDefault();
        }
    }

    handleRowsChange(rIndex, cIndex){

        return (event) => {
            this.setState(prev => {
                prev.table.rows[rIndex].scores[cIndex].value = this.refs[`cell${rIndex}_${cIndex}`].input.value;
                prev.editedCells.push(`${rIndex}_${cIndex}`);

                return prev;
            }, this.autoSaveCell(rIndex, cIndex));

            event.preventDefault();
        }
    }

    handleSave(){
        const { table } = this.state;

        Meteor.call('updateBoard', {
            id: table._id,
            table
        });
    }

    autoSaveCell = (rIndex, cIndex) => () => {
        const { table } = this.state;

        Meteor.call('updateBoardCell', {
            id: table._id,
            rIndex,
            cIndex,
            cell: table.rows[rIndex].scores[cIndex]
        })
    }

    handleHeaderCaptionChange(index){

        return (event) => {
            this.setState(prev => {
                prev.table.header[index].caption = this.refs[`caption${index}`].input.value;

                return prev;
            }, this.handleSave);

            event.preventDefault();
        }
    }


    markColumn(index){

        return (color, event) => {
            this.setState(prev => {
                _.forEach(prev.table.rows, row => {
                    row.scores[index].marked = color.hex;
                })

                return prev;
            }, this.handleSave);

            event.preventDefault();
        }
    }

    markCell(rIndex, cIndex){
        return (color, event) => {
            this.setState(prev => {
                prev.table.rows[rIndex].scores[cIndex].marked = color.hex;
                prev.editedCells.push(`${rIndex}_${cIndex}`);

                return prev;
            }, this.autoSaveCell(rIndex, cIndex));

            event.preventDefault();
        }
    }

    render() {
      const {
        header,
        rows,
      } = this.state.table;
      
      return (
        <div>
        <Table hoverable bordered>
            <thead>
                <tr>
                    <th className='name-td'>
                      Name
                    </th>
                    {header.map((item , index) => 
                    <th key={index}>
                        <ContextMenuTrigger id={'th' + index}>
                        <ThCell 
                            caption={item.caption}
                            value={new Date(item.date).toLocaleDateString()} 
                            onChange={this.handleHeaderChange(index)} 
                        />
                        </ContextMenuTrigger>
                        <ContextMenu id={'th' + index} className='white black-text' style={{zIndex: 10, padding: '10px'}}>
                          <Input 
                            type='text' 
                            placeholder={item.caption}
                            ref={`caption${index}`}
                            onBlur={this.handleHeaderCaptionChange(index)}
                            autoComplete='off'
                          />
                          <MenuItem divider className='grey'/>
                          <CirclePicker onChange={this.markColumn(index)}/>
                        </ContextMenu>
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
                rows.map((row, rIndex) => 
                    <tr key={rIndex}>
                        <td className='name-td'><Link to={'/student/' + row.userId}><Badge>{rIndex + 1}</Badge>{row.name}</Link></td>
                        {row.scores.map((item, cIndex) => 
                            <td key={`${rIndex}_${cIndex}`}> 
                                <ContextMenuTrigger id={`th${rIndex}_${cIndex}`}>
                                <TdCell  
                                    marked={item.marked} 
                                    value={item.value.toString()}
                                    edited={this.state.editedCells.includes(`${rIndex}_${cIndex}`)} 
                                />
                                </ContextMenuTrigger>
                                <ContextMenu id={`th${rIndex}_${cIndex}`} className='white black-text' style={{zIndex: 10, padding: '10px'}}>
                                  <Input
                                    type='text'
                                    ref={`cell${rIndex}_${cIndex}`}
                                    onBlur={this.handleRowsChange(rIndex, cIndex)}
                                    placeholder={item.value.toString()}
                                  />
                                  <MenuItem divider className='grey'/>
                                  <CirclePicker onChange={this.markCell(rIndex, cIndex)}/>
                                  <MenuItem onClick={e => {this.markCell(rIndex, cIndex)(false)}}>
                                  Unmark
                                  </MenuItem>
                                </ContextMenu>
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
