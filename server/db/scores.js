import {emptyDate, emptyScore, nameTableHeader} from '../constants'

Boards = new Mongo.Collection('boards');

Meteor.publish('boards', function(groupId, subjectId) {
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
    'createBoard'({groupId, subjectId, name}){

        if(!Roles.userIsInRole(Meteor.userId(), 'teacher')){
            throw new Meteor.Error(403, 'Request without permissions');
        }

        const group = Groups.findOne(groupId);

        const rows = 
            Meteor.users.find({ _id : { $in: group.students.map(s => s.userId)}})
            .fetch()
            .map(user => ({
                userId: user._id,
                name: user.profile.name,
                avg: emptyScore,
                sum: emptyScore,
                progress: [],
                scores: []
            }));

        return Boards.insert({
            groupId,
            subjectId,
            name,
            header: [nameTableHeader],
            rows
        });
    },
    'updateBoard'({id, table}){
        if(!Roles.userIsInRole(Meteor.userId(), 'teacher')){
            throw new Meteor.Error(403, 'Request without permissions');
        }

        _.forEach(table.rows, (row) => {
            row.avg = lodash.mean(row.scores.map(score => {
                const num = parseInt(score);
                if(!!num) return num;
            }));
            row.sum = lodash.sum(row.scores.map(score => {
                const num = parseInt(score);
                if(!!num) return num;
            }));
        })

        console.log(table);

        Boards.update(id, table);

    }
});