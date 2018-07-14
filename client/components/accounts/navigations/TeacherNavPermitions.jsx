import React from 'react';
import * as routes from '../../../constants/routes';
import { NavItem } from 'react-materialize';

const TeacherNavPermitions = () => 
    <span>
        <NavItem href={routes.TEACHER_GROUPS}>
            Groups
        </NavItem>
        <NavItem href={routes.TEACHER_SUBJECTS}>
            Disciplines
        </NavItem>
        <NavItem>
            Students
        </NavItem>
    </span>

export default TeacherNavPermitions;