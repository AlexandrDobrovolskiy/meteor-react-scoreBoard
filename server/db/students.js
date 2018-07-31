Students = new Mongo.Collection('students');

const fiveDays = 5 * 24 * 60 * 60 * 1000;

setInterval(() => {
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
        Students.update(progress.id, {progress: { $set: progress.progress}});
    });
}, fiveDays);

Meteor.methods({
    'addStudent'({userId, groupId, avgScore, rating}){
        return Students.insert({userId, groupId, avgScore});
    },
    'updateRating'(studentId){

        const   student = Students.findOne(studentId),
                boards = Boards.find({ rows : { $elemMatch: { userId: student.userId}}}).fetch(),
                allAvg = boards.map(board => {
                    return lodash.find(board.rows, row => row.userId === student.userId).avg;
                })
        
        Students.update(studentId, { avgScore: lodash.mean(allAvg), rating: lodash.sum(allAvg)});
    }
});