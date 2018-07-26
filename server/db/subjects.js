Subjects = new Mongo.Collection('subjects');

Meteor.publish('groupSubjects', function(groupId){
    if(Roles.userIsInRole(Meteor.userId(), 'teacher'))
        return Subjects.find({groups: { $elemMatch: {groupId}}});
    else{
        throw new Meteor.Error(403, 'Request without permitions.');
    }
});

Meteor.publish('subject', function(id){
    let subject = Subjects.findOne(id);

    if(!subject){
        return null;
    }

    let students = [];
    
    _.forEach(Groups.find({_id: { $in: subject.groups}}).fetch(), (group) => {
        students.push(...group.students);
    })
    
    if(Roles.userIsInRole(Meteor.user(), ['teacher'])
        || _.some(students, () => { return {userId: Meteor.userId()}})){

        return Subjects.find(id);
    }else{
        throw new Meteor.Error(403, 'Request without permissions.');
    }
});

Meteor.methods({
    'addSubject'({name, groups}){
        let _id = Subjects.insert({
                    name,
                    groups: groups.map((group) => {
                        return {
                            _id: group._id
                        }
                    })
                });

        groups.forEach(group => {
            Groups.update({_id: group._id}, { $push:{
                disciplines: { 
                    _id
                }
            }});
        });
    },
});