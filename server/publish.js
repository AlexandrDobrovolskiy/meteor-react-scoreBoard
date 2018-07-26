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


