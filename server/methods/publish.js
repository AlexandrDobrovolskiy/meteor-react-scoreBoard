Groups = new Mongo.Collection('groups');
Subjects = new Mongo.Collection('subjects');

Meteor.publish('allGroups', function() {
    if(Roles.userIsInRole(Meteor.user(), ['teacher'])){
        return Groups.find();
    }else{
        throw new Meteor.Error(403, 'Request without permissions.');
    }
});

Meteor.publish('allSubjects', function(){
    if(Roles.userIsInRole(Meteor.user(), ['teacher'])){
        return Subjects.find();
    }else{
        throw new Meteor.Error(403, 'Request without permissions.');
    }
});

Meteor.publish('group', function(id){
    let group = Groups.findOne(id);

    if(!group){
        return null;
    }

    if(Roles.userIsInRole(Meteor.user(), ['teacher'])
        || _.some(group.students, () => { return {userId: Meteor.userId()}})){

        return Groups.find(id);
    }else{

        throw new Meteor.Error(403, 'Request without permissions.');
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
