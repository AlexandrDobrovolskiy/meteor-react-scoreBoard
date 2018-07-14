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

        this.state = {
            subscriptions: {
                group: Meteor.subscribe('group', this.props.group),
                discipline: Meteor.subscribe('subject', this.props.discipline)
            },

            newCols: []
        }
    }

    group(){
        return Groups.findOne(this.props.group);
    }

    getRows(){
        let data = this.group();
        console.log(data);
    }

    groupSubject(){
        return _.find(this.group().disciplines, dis => dis._id === this.props.discipline);
    }

    discipline(){
        return Subjects.findOne(this.props.discipline);
    }

    isReady(){
        return !!this.group() && !!this.discipline();
    }

    componentWillUnmount = () => {
        this.state.subscriptions.group.stop();
    }

    render() {
        this.getRows();
        if(!this.isReady()){

            return <Preloader flashing size='big'/>
        }else if (!this.discipline()){

            return <h1>There is no disciplines related to this group yet.</h1>
        }else if (!this.groupSubject().scores || this.groupSubject().scores.length < 1){

            return <h2> There is no students registered in this group yet.</h2>
        }else{
            return (
                <form>
                    <Breadcrumb>
                      <MenuItem>{this.group().name}</MenuItem>
                      <MenuItem>{this.discipline().name}</MenuItem>
                    </Breadcrumb>
              
                    <Table bordered={true} hoverable={true}>
                      <thead>
                        <tr>
                            <th className={'name-td'} rowSpan={2}>Name</th>
                            <th colSpan={this.groupSubject().scores[0].scores.length + 3}>Scores</th>
                        </tr>
                        <tr>
                          {this.groupSubject().scores[0].scores.map((score, index) => {
                              return <td className={'score-td'}><DateCell key={index} value={score.date || ' '}/></td>
                          })}
                          <td className={'score-td'}><DateCell value={new Date()}/></td>
                          <th className={'score-td'}>Average</th>
                          <th className={'score-td'}>Sum</th>
                        </tr>
                      </thead>
                      
                      <tbody>
                          {   
                              this.groupSubject().scores.map((student, RowIndex) => {
                                    return (
                                        <tr key={RowIndex}>
                                            <td className={'name-td'}>{this.group().students[RowIndex].name}</td>
                                            {student.scores.map((score, ColIndex) => {
                                                return (
                                                    <td key={ColIndex} className={'score-td'}><EditableCell value={score.score} /></td>
                                                )
                                            })}
                                            <td className={'score-td'}>
                                                <EditableCell value={''} />
                                            </td>
                                            <td className={'score-td'}>
                                                {student.avg}
                                            </td>
                                            <td className={'score-td'}>
                                                {student.sum}
                                            </td>
                                        </tr>
                                    )
                              })
                          }
                      </tbody>
                    </Table>
                    <Button floating fab='vertical' icon='mode_edit' className='red' large style={{bottom: '45px', right: '24px'}}>
                      <Button floating icon='save' className='blue'/>
                      <Button floating icon='file_download' className='green'/>
                      <Button floating icon='publish' className='yellow darken-1'/>
                      <Button floating icon='attach_file' className='blue'/>
                    </Button>
                </form>
            )
        }
    }
}
