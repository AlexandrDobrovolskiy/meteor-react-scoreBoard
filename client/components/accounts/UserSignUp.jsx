import React, { Component } from 'react';
import * as roles from '../../constants/roles';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { 
    Modal,
    Button,
    Row,
    Input } 
from 'react-materialize';

const INITIAL_STATE = {
    username: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    role: 'student',
    group: 'default',
    groups: [],
    error: null,
};

const updateByPropertyName = (propertyName, value) => () => ({
    [propertyName]: value,
});

export default class UserSignUp extends TrackerReact(Component) {
    constructor (props){
        super(props);
        this.state = {...INITIAL_STATE}
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount = () => {
      Meteor.call('getGroupNames', (err, res) => {
        if(err){
            console.log(err);
        }
        this.setState({groups: res});
      });
    }
    

    handleSubmit(event) {
        let group = this.state.groups[this.state.group],
            user = {  
                email: this.state.email,
                password: this.state.passwordOne,
                profile : {
                    name: this.state.username,
                    groups: [group]
                }
            }, 
            role = this.state.role, 
            groupId = !!group ? group._id : null;
        
        Accounts.createUser(user, (error) => { 
            if(error){
                this.setState(updateByPropertyName('error', error.reason));
            }else {
                Meteor.call('onUserRegistered', {
                    name: user.username,
                    userId: Meteor.userId(),
                    groupId,
                    roles: [role]
                }, (err, res) => {
                    if(!err){
                        FlowRouter.go('/' + role);
                    }
                });

                $('#user-sign-up-modal').modal('close');
            }
        });

        event.preventDefault();
    }

  render() {
    const {
        username,
        email,
        passwordOne,
        passwordTwo,
        role,
        group
      } = this.state;
    

    let isInvalid = () =>
        passwordOne !== passwordTwo ||
        passwordOne === '' ||
        username === '' ||
        email === '' ||
        !email.includes('@') ||
        !email.includes('.') || 
        (role !== 'teacher' && group === 'default')

    return (
        <div>
            <div onClick={() => {
                        $('#user-sign-up-modal').modal('open')
                    }}>
                    Sign Up
            </div>
            <Modal
              id='user-sign-up-modal'
              header='Sign Up'
              actions={[]}
            >
                <form 
                    type="submit"
                    onSubmit={this.handleSubmit.bind(this)} 
                >
                  <Row>
                    <Input 
                        label="Full Name"
                        ref="name"
                        value={username}
                        validate
                        onChange={event => this.setState(updateByPropertyName('username', event.target.value))}
                        required
                        s={12} 
                    />
                    <Input 
                        type="email" 
                        label="Email" 
                        ref="email" 
                        onChange={event => this.setState(updateByPropertyName('email', event.target.value))}
                        validate 
                        value={email}
                        required 
                        s={12} 
                    />
                    <Input 
                        type="password" 
                        label="password" 
                        ref="password"
                        onChange={event => this.setState(updateByPropertyName('passwordOne', event.target.value))}
                        value={passwordOne} 
                        validate
                        required 
                        s={12} 
                    />
                    <Input 
                        type="password" 
                        label="password repeat" 
                        ref="passwordRepeat" 
                        onChange={event => this.setState(updateByPropertyName('passwordTwo', event.target.value))}
                        value={passwordTwo}
                        required 
                        s={12}
                    />
                    <Input 
                        s={6} 
                        type='select' 
                        defaultValue={roles.STUDENT} 
                        onChange={event => {
                            this.setState(updateByPropertyName('role', event.target.value))
                            this.setState(updateByPropertyName('group', 'default'))
                            }}
                    >
                        <option value={roles.TEACHER}>Teacher</option>
                        <option value={roles.STUDENT}>Student</option>
                    </Input>
                    {   this.state.role === 'student' &&
                        <Input 
                        s={6} 
                        type='select' 
                        defaultValue={'default'} 
                        onChange={event => this.setState(updateByPropertyName('group', event.target.value))}
                        >
                        <option value={'default'}>Choose group</option>
                        {
                            this.state.groups.map((group, index) => {
                                return (
                                    <option value={index} key={index}>{group.name}</option>
                                )
                            })
                        }
                        
                        </Input>
                    }
                </Row>
                    <Button 
                        waves='light'
                        className="right sign-button"   
                        disabled={isInvalid()} 
                        onClick={this.handleSubmit}
                    >
                        Sign Up
                    </Button>
                </form>
                <blockquote>
                        {!!this.state.error && this.state.error}
                </blockquote>
            </Modal>
        </div>
    )       
  }
}
