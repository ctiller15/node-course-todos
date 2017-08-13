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

	// db.collection('Todos').find({
	// 	_id: new ObjectID("59908c4cd4fb4e306eba70c3")
	// }).toArray().then((docs) => {
	// 	console.log('Todos');
	// 	console.log(JSON.stringify(docs, undefined, 2));
	// }, (err) => {
	// 	console.log('Unable to fetch todos', err);
	// });

	// db.collection('Todos').find().count().then((count) => {
	// 	console.log(`Todos count: ${count}`);
	// }, (err) => {
	// 	console.log('Unable to fetch todos', err);
	// });
	db.collection('Users').find({
		name: 'Christopher'
		}).toArray().then((docs) => {
			console.log('Users');
			console.log(JSON.stringify(docs, undefined, 2));
	}, (err) => {
		console.log('Unable to fetch users', err);
	});
	// db.close();
});

