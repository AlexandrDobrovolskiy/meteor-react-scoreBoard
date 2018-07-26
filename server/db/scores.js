import {emptyDate, emptyScore, nameTableHeader} from '../constants'

Boards = new Mongo.Collection('boards');

Meteor.publish('board', function(groupId, subjectId) {
    if(Roles.userIsInRole(Meteor.user(), ['teacher'])){
        return Boards.find({groupId, subjectId});
    }else{
        throw new Meteor.Error(403, 'Request without permissions.');
    }
});

Meteor.publish('boardsForGroup', function(groupId) {
    if(Roles.userIsInRole(Meteor.user(), ['teacher'])){
        return Boards.find({groupId});
    }else{
        throw new Meteor.Error(403, 'Request without permissions.');
    }
});

Meteor.methods({
    'addScoreForStudent'({studentId, subjectId, groupId, date, score}){
        return Scores.insert({
            studentId,
            subjectId,
            groupId,
            date,
            score
        });
    },
    'getStudentScores'(studentId){
        return Scores.find({studentId});
    },
    'getGroupScores'({groupId}){
        return Scores.find({groupId});
    },
    'getSubjectScores'(subjectId){
        return Scores.find({subjectId});
    },
    'createBoard'({groupId, subjectId, name}){
        const group = Groups.findOne(groupId);

        const rows = Meteor.users.find({ $in: group.students}).fetch().map(student => [student.profile.name, emptyScore]);

        return Boards.insert({
            groupId,
            subjectId,
            name,
            header: [nameTableHeader, emptyDate],
            rows
        });
    }
});