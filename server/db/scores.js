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

Meteor.publish('board', function(id){
    if(Roles.userIsInRole(Meteor.user(), ['teacher'])){
        return Boards.find(id);
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
    'updateBoardRow'({id, call, rIndex, cIndex, value}){
        if(!Roles.userIsInRole(Meteor.userId(), 'teacher')){
            throw new Meteor.Error(403, 'Request without permissions');
        }

        const row = Boards.findOne(id).rows[rIndex];

        if(!row){
            throw new Meteor.Error('Invalid row index');
        }

        switch (call){
            case 'score':
                row.scores[cIndex].value = value;
                break;
            case 'mark':
                row.scores[cIndex].marked = value;
                break;
            default:
                break;
        }

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
    'updateBoardNewColumn'({id}){
        if(!Roles.userIsInRole(Meteor.userId(), 'teacher')){
            throw new Meteor.Error(403, 'Request without permissions');
        }

        const board = Boards.findOne(id);

        board.header.push({
            date: new Date(), 
            caption: 'Lesson ' + board.header.length
        });

        board.rows.forEach(row => {
            row.scores.push({
                value: 0,
                marked: false,
            })
        });

        Boards.update(id, board);
    },
    'updateBoardHeader'({id, index, call, value}){
        if(!Roles.userIsInRole(Meteor.userId(), 'teacher')){
            throw new Meteor.Error(403, 'Request without permissions');
        }

        const cell = Boards.findOne(id).header[index];

        if(!cell){
            throw new Meteor.Error('Invalid header index');
        }

        switch (call){
            case 'caption':
                cell.caption = value;
                break;
            case 'date':
                cell.date = value;
                break;
            default:
                break;
        }

        let modifier = { $set: {}};
        modifier.$set[`header.${index}`] = cell; 

        Boards.update(id, modifier);
    },
    'updateBoardMarkColumn'({id, index, color}){
        if(!Roles.userIsInRole(Meteor.userId(), 'teacher')){
            throw new Meteor.Error(403, 'Request without permissions');
        }

        const board = Boards.findOne(id);

        board.rows.forEach(row => {
            row.scores[index].marked = color;
        });

        Boards.update(id, board);
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