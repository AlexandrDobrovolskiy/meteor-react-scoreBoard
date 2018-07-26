let disComp = (id) => (dis) => dis._id === id;

Meteor.methods({
    'getRows'({groupId, disciplineId}){
        let group = Groups.findOne(groupId),
            subject = Subjects.findOne(disciplineId);
            users = Meteor.users;

        if(!group){
            throw new Meteor.Error('No groups found');
        }
        if(!subject){
            throw new Meteor.Error('No disciplines found');
        }

        let disciplineScores = _.find(group.disciplines, disComp(disciplineId)); 

        return  [
                    ['Name', ...disciplineScores.scores[0].scores.map(score => score.date), 'Average', 'Sum'],
                    ...disciplineScores.scores.map(student => 
                        [ users.findOne(student.userId).profile.name, ...student.scores.map(score => score.score), student.avg, student.sum])
                ];   
    }
});