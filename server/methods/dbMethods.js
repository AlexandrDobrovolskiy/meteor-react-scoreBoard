Meteor.methods({
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