const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
// 	console.log(result);
// });

//Todo.findOneAndRemove
//Todo.findByIdAndRemove

// Todo.findOneAndRemove({_id: '5999be882e433afa8a5c348d'}).then((todo) => {

// });

Todo.findByIdAndRemove('5999be882e433afa8a5c348d').then((todo) => {
	console.log(todo);
});