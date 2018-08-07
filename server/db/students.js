Students = new Mongo.Collection('students');

const fiveDays = 15 * 1000;

Meteor.setInterval(() => {
    const students = Students.find().fetch();
    const mapProgress = students.map(student => {
        student.progress.push({score: student.avgScore, date: new Date()});

        let length = student.progress.length;

        if(length > 20){
            return {id: student._id, progress: student.progress.slice(length - 20, length)}
        }

        return {id: student._id, progress: student.progress};
    });

    _.forEach(mapProgress, progress => {
        Students.update(progress.id, {$set: {progress: progress.progress}});
    });
}, fiveDays);

Meteor.publish('student', function(userId){
    return Students.find({userId});
});

Meteor.methods({
    'addStudent'({userId, groupId, avgScore, rating}){
        return Students.insert({userId, groupId, avgScore, rating, progress: []});
    },
    'updateRating'(studentId){

        const   student = Students.findOne(studentId),
                boards = Boards.find({ rows : { $elemMatch: { userId: student.userId}}}).fetch(),
                allAvg = boards.map(board => {
                    return lodash.find(board.rows, row => row.userId === student.userId).avg;
                })
        
        Students.update(studentId,{ $set: { avgScore: lodash.mean(allAvg), rating: lodash.sum(allAvg)}});
    }
});