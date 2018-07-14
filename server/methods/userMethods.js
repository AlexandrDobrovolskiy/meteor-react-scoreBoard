import { BLANK_SCORES } from "../constants";

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
    'addGroup'(name){
        Groups.insert({
            name,
            students: [],
            disciplines: []
        });
    },
    'onUserRegistered'({userId, name, roles, groupId}){
        Roles.addUsersToRoles(userId, roles);

        if(_.some(roles, () => 'student')){
            let group = Groups.findOne(groupId);
            group.disciplines.forEach((discipline) => {
                    discipline.scores.push({
                    userId,
                    name,
                    avg: 0,
                    sum: 0,
                    scores: BLANK_SCORES
                });
            });
            
            Groups.update(groupId, {
                $push: { students: {
                    userId,
                    name: name
                }},
                $set: {disciplines: group.disciplines}
            },);
        }
    },
    'addDiscipline'({name, groups}){
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
                    _id,
                    scores: []
                }
            }});
        });
    },
});