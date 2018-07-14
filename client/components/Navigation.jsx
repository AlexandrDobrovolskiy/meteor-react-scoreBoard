import React, { Component } from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Navbar, NavItem } from 'react-materialize';
import UserSignUp from '../components/accounts/UserSignUp';
import UserSignIn from '../components/accounts/UserSignIn';
import * as routes from '../constants/routes';
import * as roles from '../constants/roles';
import TeacherNavPermitions from './accounts/navigations/TeacherNavPermitions';
import StudentNavPermitions from './accounts/navigations/StudentNavPermitions';


export default class Navigation extends TrackerReact(Component) {
    constructor(props){
        super(props);
        this.handleSignOut = this.handleSignOut.bind(this);
    }

    handleSignOut(event) {
        Meteor.logout(() => {
            FlowRouter.go(routes.HOME);
        });
        event.preventDefault();        
    }

    auth(){
        return (
            <span>
                {
                    Roles.userIsInRole(Meteor.userId(), roles.TEACHER)
                    && <TeacherNavPermitions /> 
                }
                {
                    Roles.userIsInRole(Meteor.userId(), roles.STUDENT)
                    && <StudentNavPermitions /> 
                }
                <NavItem onClick={this.handleSignOut}>
                        Sign Out
                </NavItem>
            </span>
        )
    }

    nonAuth(){
        return (
            <span>
              <NavItem><UserSignUp /></NavItem> 
              <NavItem><UserSignIn /></NavItem>
            </span>
        )
    }

    render() {
        return (
            <Navbar brand='ScoreBoard' right>
                { Meteor.userId() ? this.auth() : this.nonAuth()}
            </Navbar>
        )
    }
} 
