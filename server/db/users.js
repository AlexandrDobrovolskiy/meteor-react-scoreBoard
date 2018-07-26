Meteor.methods({
    'addRoles'({ userId, roles }) {
      Roles.addUsersToRoles(userId, roles);
    },
    'userIsInRole'({roles}){
        var loggedInUser = Meteor.user();

        if (Roles.userIsInRole(loggedInUser, roles)) {
            return true;
        }

        throw new Meteor.Error(403, "Not authorized");
    },
    //@TODO: make next methods more secure with user permitions checking
    'onUserRegistered'({userId, name, roles, groupId}){
        Roles.addUsersToRoles(userId, roles);

        if(_.some(roles, () => 'student')){
            let group = Groups.findOne(groupId);

            Meteor.call('addStudent', {
                userId,
                groupId,
                avgScore: 0
            });
            Groups.update(groupId, {
                $push: { students: {
                    userId,
                    name
                }},
                $set: {disciplines: group.disciplines}
            },);
        }
    },
});