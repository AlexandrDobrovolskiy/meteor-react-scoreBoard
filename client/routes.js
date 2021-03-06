import React from 'react';
import { mount } from 'react-mounter';
import App from './App.jsx';
import * as routes from './constants/routes';
import * as roles from './constants/roles';
import { MainLayout } from './layouts/MainLayout.jsx'
import { FooterNav } from './components/FooterNav';
import StudentProfile from './components/accounts/profiles/StudentProfile';
import TeacherProfile from './components/accounts/profiles/TecherProfile';
import GroupsWrapper from './components/accounts/teacher/GroupsWrapper';
import DisciplinesWrapper from './components/accounts/teacher/DisciplinesWrapper';
import ScoreBoard from './components/accounts/teacher/boards/ScoreBoard';
import GroupProfile from './components/accounts/profiles/GroupProfile';

const studentRoutes = FlowRouter.group({
    prefix: routes.STUDENT,
    name: 'student',
    triggersEnter: [(context, redirect) => {
        console.log('student group triggers');
    }]
});

const adminRoutes = FlowRouter.group({
    prefix: routes.ADMIN,
    name: 'admin',
    triggersEnter: [(context, redirect) => {
        console.log('running group triggers');  
    }]
});

const teacherRoutes = FlowRouter.group({
    prefix: routes.TEACHER,
    name: 'teacher',
    triggersEnter: [(context, redirect) => {
        console.log('teacher group triggers');
    }]
});

studentRoutes.route('/', {
    action() {
        mount(MainLayout, {
            content: (<StudentProfile />),
            footer: (<FooterNav />)
        })
    }
});

teacherRoutes.route('/', {
    action() {
        mount(MainLayout, {
            content: (<TeacherProfile />),
            footer: (<FooterNav />)
        })
    }
});

teacherRoutes.route('/groups', {
    action() {
        mount(MainLayout, {
            content: (<GroupsWrapper />),
            footer: (<FooterNav />)
        })
    }
});

teacherRoutes.route('/subjects', {
    action() {
        mount(MainLayout, {
            content: (<DisciplinesWrapper/>),
            footer: (<FooterNav />)
        })
    }
});

teacherRoutes.route('/:disciplineId/:groupId', {
    action(params, query) {
        mount(MainLayout, {
            content: (<ScoreBoard discipline={params.disciplineId} group={params.groupId}/>),
            footer: (<p></p>)
        })
    }
});

FlowRouter.route('/group/:id', {
    action(params, query){
        mount(MainLayout, {
            content: (<GroupProfile id={params.id}/>),
            footer: (<FooterNav />)
        })
    }
});

studentRoutes.route('/:id', {
    action(params) {
        mount(MainLayout, {
            content: (<StudentProfile id={params.id} />),
            footer: (<p>This is fucken footer, Ill do it later</p>)
        })
    }
});

FlowRouter.route('/', {
    action() {
        mount(MainLayout, {
            content: (<App />),
            footer: (<FooterNav />)
        })
    }
});