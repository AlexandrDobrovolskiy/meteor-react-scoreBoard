import React, { Component } from 'react'
import { Grid, AutoSizer } from 'react-virtualized'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import { Input } from 'react-materialize'
import ThCell from './ThCell';
import TdCell from './TdCell';
import {
    ContextMenu, 
    MenuItem, 
    ContextMenuTrigger } from "react-contextmenu";
import { CirclePicker } from 'react-color'

export default class EfficientBW extends TrackerReact(Component) {
    constructor(props){
        super(props);

        this.state = {
            subscriptions: {
                board: Meteor.subscribe('board', this.props.board)
            }
        }

        this.cellRenderer = this.cellRenderer.bind(this);
        this.handleNewColumn = this.handleNewColumn.bind(this);
        this.handleHeaderChange = this.handleHeaderChange.bind(this);
        this.handleUpdateHeaderCaption = this.handleUpdateHeaderCaption.bind(this);
        this.handleUpdateScore = this.handleUpdateScore.bind(this);
        this.autoSaveHeader = this.autoSaveHeader.bind(this);
        this.autoSaveRow = this.autoSaveRow.bind(this);
    }

    handleNewColumn = (event) => {
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


  cellRenderer ({ columnIndex, key, rowIndex, style }) {

      const board = this.board();

      if(rowIndex === 0){
        const item = board.header[columnIndex];

        if(columnIndex === 0 ){
            return 'Name'
        }

        return (
            <div
              key={key}
              style={style}
            >
            <ContextMenuTrigger id={'th' + columnIndex}>
                <ThCell 
                    caption={item.caption}
                    value={new Date(item.date).toLocaleDateString()} 
                    onChange={this.handleHeaderChange(columnIndex)} 
                />
                </ContextMenuTrigger>
                <ContextMenu id={'th' + columnIndex} className='white black-text td-context'>
                  <Input 
                    type='text' 
                    placeholder={item.caption}
                    onChange={this.handleUpdateHeaderCaption(columnIndex)}
                    autoComplete='off'
                  />
                  <MenuItem divider className='grey'/>
                  <CirclePicker onChange={this.markColumn(columnIndex)}/>
            </ContextMenu>
            </div>
        )
      }else{ 
        
        const row = this.board().rows[rowIndex];

        if(columnIndex === 0){
            return row.name;
        }

        const item = this.board().rows[rowIndex].scores[columnIndex];

        return (
            <div
              key={key}
              style={style}
            >
                <ContextMenuTrigger id={`th${rowIndex}_${columnIndex}`}>
                <TdCell  
                    marked={item.marked} 
                    value={item.value.toString()}
                    //edited={this.state.editedCells.includes(`${rowIndex}_${columnIndex}`)} 
                />
                </ContextMenuTrigger>
                <ContextMenu id={`th${rowIndex}_${columnIndex}`} className='white black-text td-context'>
                  <Input
                    type='text'
                    onChange={this.handleUpdateScore(rowIndex, columnIndex)}
                    placeholder={item.value.toString()}
                  />
                  <MenuItem divider className='grey'/>
                  <CirclePicker onChange={this.markCell(rowIndex, columnIndex)}/>
                  <MenuItem onClick={e => {this.markCell(rowIndex, columnIndex)(false)}}>
                  Unmark
                  </MenuItem>
                </ContextMenu>
            </div>
        )
      }
  }

  board = () => Boards.findOne(this.props.board);

  componentWillUnmount = () => {
    this.state.subscriptions.board.stop();
  }

  render() {

    if(!this.board()) return 's'

    return (
      <div style={{height: '80em'}}>
      <AutoSizer>
        {({width, height}) => (
            <Grid
              cellRenderer={this.cellRenderer}
              columnCount={this.board().header.length}
              rowHeight={40}
              columnWidth={100}
              rowCount={this.board().rows.length}
              height={height}
              width={width}
            />
        )}
      </AutoSizer>
      </div>
    )
  }
}
