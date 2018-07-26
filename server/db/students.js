Students = new Mongo.Collection('students');

Meteor.methods({
    'addStudent'(newStudent){
        return Students.insert(newStudent);
    }
});