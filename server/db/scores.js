import {emptyDate, emptyScore, nameTableHeader} from '../constants'

Boards = new Mongo.Collection('boards');

Meteor.publish('groupSubjectBoards', function(groupId, subjectId) {
    if(Roles.userIsInRole(Meteor.user(), ['teacher'])){
        return Boards.find({groupId, subjectId});
    }else{
        throw new Meteor.Error(403, 'Request without permissions.');
    }
});

Meteor.publish('groupBoards', function(groupId) {
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
                scores: []
            }));

        return Boards.insert({
            groupId,
            subjectId,
            name,
            header: [],
            rows
        });
    },
    'updateBoard'({id, table}){
        if(!Roles.userIsInRole(Meteor.userId(), 'teacher')){
            throw new Meteor.Error(403, 'Request without permissions');
        }

        _.forEach(table.rows, (row) => {
            row.avg = lodash.mean(lodash.compact(row.scores.map(score => {
                const num = parseInt(score.value);
                if(!!num) return num;
            })));
            row.sum = lodash.sum(row.scores.map(score => {
                const num = parseInt(score.value);
                if(!!num) return num;
            }));
        })

        Boards.update(id, table);
        
        _.forEach(table.rows, (row) => {
            let userId = row.userId;
            Meteor.call('updateRating', Students.findOne({userId}));
        });
    },
    'updateBoardCell'({id, rIndex, cIndex, cell}){
        if(!Roles.userIsInRole(Meteor.userId(), 'teacher')){
            throw new Meteor.Error(403, 'Request without permissions');
        }

        const row = Boards.findOne(id).rows[rIndex];

        if(!row){
            throw new Meteor.Error('Invalid row index');
        }

        row.scores[cIndex] = cell;

        row.avg = lodash.mean(lodash.compact(row.scores.map(score => {
            const num = parseInt(score.value);
            if(!!num) return num;
        })));
        row.sum = lodash.sum(row.scores.map(score => {
            const num = parseInt(score.value);
            if(!!num) return num;
        }));

        let modifier = { $set: {}};
        modifier.$set[`rows.${rIndex}`] = row; 

        Boards.update(id, modifier);

        let userId = row.userId;
        Meteor.call('updateRating', Students.findOne({userId}));

    },
    'updateBoardHeader'({id, rIndex, cIndex, header}){
        if(!Roles.userIsInRole(Meteor.userId(), 'teacher')){
            throw new Meteor.Error(403, 'Request without permissions');
        }
    },
    'addStudentToBoards'(userId){
        const user = Meteor.users.findOne(userId),
              groupIds = Groups.find({students: {$elemMatch: {userId}}}).fetch().map(g => g._id),
              boards = Boards.find({groupId : { $in: groupIds}}).fetch();

        if(!!user){
            _.forEach(boards, board => {
                let length = board.rows.length > 0 ? board.rows[0].scores.length : 0;

                Boards.update(board._id, { $push: { rows: {
                    userId: user._id,
                    name: user.profile.name,
                    avg: emptyScore,
                    sum: emptyScore,
                    scores: lodash.fill(Array(length), emptyScore).map(value => ({ marked: false, value})),
                }}});
            });
        }
    }
});