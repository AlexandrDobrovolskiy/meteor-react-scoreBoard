import React, { Component } from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import *  as constants from '../constants/boards'

import { 
    Table,
    Input,
    Icon,
    Button
} from 'react-materialize'

const EditableCell = ({onChange, value}) => {
    return (
        <div>
        <Input
            type='text'
            onChange={onChange}
            defaultValue={value}
        />
        </div>
    )
}

const EditableDateCell = () => {
    return (
        <div>
        </div>
    )
}

export default class BoardWrapper extends TrackerReact(Component) {
    constructor(props){
        super(props);
        console.log(this.props.board);

        this.state = {
            table: this.props.board
        }

        this.handleNewColumn = this.handleNewColumn.bind(this);
        this.handleRowsChange = this.handleRowsChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    handleNewColumn(event){
        const { table } = this.state;
        if(table.header.length < constants.MAX_COLUMNS){
            this.setState(prev => {
                prev.table.header.push(new Date().toDateString());
                _.forEach(prev.table.rows, row => {
                    row.scores.push(0)
                });
    
                return prev;
            })    
        }else{
            //TODO: nice toast with caption "No more columns allowed, you may create new board"
        }
        
        event.preventDefault();
    }

    handleRowsChange(rowIndex, colIndex){
        return (event, value) => {
            this.setState(prev => {
                prev.table.rows[rowIndex].scores[colIndex] = value;
                return prev;
            });

            event.preventDefault();
        }
    }

    handleSave(event){
        const { table } = this.state;
        Meteor.call('updateBoard', {
            id: table._id,
            table
        });
        event.preventDefault();
    }

    render() {
      const {
        header,
        rows
      } = this.state.table;
      
      return (
        <div>
        <Table hoverable>
            <thead>
                <tr>
                    {header.map((item , index)=> <th key={index}>{item}</th>)}
                    <th>
                      <div
                        onClick={this.handleNewColumn}
                      >
                        <Icon>
                        add
                        </Icon>
                      </div>
                    </th>
                    <th>
                        Average
                    </th>
                    <th>
                        Sum
                    </th>
                </tr>
            </thead>
            <tbody>
                {
                    rows.map((row, rIndex) => 
                        <tr key={rIndex}>
                            <td>{row.name}</td>
                            {row.scores.map((item, cIndex) => <td key={`${rIndex}_${cIndex}`}> <EditableCell onChange={this.handleRowsChange(rIndex, cIndex)} value={item.toString()} /></td>)}
                            <td> </td>
                            <td>{lodash.ceil(row.avg, 2)}</td>
                            <td>{lodash.ceil(row.sum, 2)}</td>
                        </tr>
                    )
                }
            </tbody>
        </Table>
        <Button floating fab='vertical' faicon='fa fa-plus' icon='mode_edit' className='red' large style={{bottom: '45px', right: '24px'}}>
          <Button floating icon='save' onClick={this.handleSave} className='blue'/>}>
          <Button floating icon='file_download' className='green darken-1'/>
          <Button floating icon='group_add' className='yellow'/>
          <Button floating icon='attach_file' className='blue'/>
        </Button>
        </div>
      )
    }
}
