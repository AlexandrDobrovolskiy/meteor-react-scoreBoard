Groups = new Mongo.Collection('groups');

Meteor.methods({
    'addGroup'(name){
        Groups.insert({
            name,
            students: [],
            disciplines: []
        });
    },
    'getGroupNames'(){
        return Groups.find().fetch().map((group, index) => {
            return {
                _id: group._id,
                name: group.name,
                students: group.students
            }
        });
    },
});