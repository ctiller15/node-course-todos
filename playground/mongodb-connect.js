// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// var user = {name: 'chris', age: 24};
// var {name} = user;
// console.log(name); // chris

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if (err) {
		return console.log('Unable to connect to MongoDB server');
	}
	console.log('Connected to MongoDB server');

	// db.collection('Todos').insertOne({
	// 	text: 'Something to do',
	// 	completed: false
	// }, (err, result) => {
	// 	if (err) {
	// 		return console.log('Unable to insert todo', err);
	// 	}

	// 	console.log(JSON.stringify(result.ops, undefined, 2));
	// });

	// insert new doc into 'Users' collection. (name, age, location);
	// insert w/ insertOne.
	// Pass in new collection name.
	// add some error handling.
	// print ops to screen.
	// db.collection('Users').insertOne({
	// 	name: 'Christopher',
	// 	age: 24,
	// 	location: 'Florida'
	// }, (err, result) => {
	// 	if (err) {
	// 		return console.log('Unable to insert user', err);
	// 	}
	// 	console.log(result.ops[0]._id.getTimestamp());
	// });

	db.close();
});

