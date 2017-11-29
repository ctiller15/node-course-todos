require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongoose');

var {mongoose} = require('./db/mongoose')
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
	var todo = new Todo({
		text: req.body.text
	});

	todo.save().then((doc) => {
		res.send(doc);
	}, (err) => {
		res.status(400).send(err);
	});
	
});

app.get('/todos', (req, res) => {
	Todo.find().then((todos) => {
		res.send({todos});
	}, (e) => {
		res.status(400).send(e);
	});
});

// GET /todos/1234324
app.get('/todos/:id', (req, res) => {
	var id = req.params.id;

	if(!mongoose.Types.ObjectId.isValid(id)){
		res.status(404).send({});
		return console.log("Invalid ID");
	}

	Todo.findById(id).then((todo) => {
		if(todo){
			res.send({todo});
			console.log("successful!")
		} else if(!todo){
			res.status(404).send({});
			console.log("Todo not found")
		}
	}, (err) => {
		res.status(400).send({});
		console.log("Error");
	});

});

app.delete('/todos/:id', (req, res) => {
	// get the id
	var id = req.params.id;
	// validate id -> not valid? Return 404.
	if(!mongoose.Types.ObjectId.isValid(id)){
		res.status(404).send({});
		console.log("invalid id");
		return;
	}
	// remove todo by id
	Todo.findByIdAndRemove(id).then((todo) => {
		if(!todo){
			res.status(400).send({});
			console.log("Todo not found");
			return;
		} else if(todo){
			res.status(200).send({todo});
			console.log("success!");
		}
	}).catch((err) => {
		res.status(400).send({});
		console.log("Error!");
	});
});

app.patch('/todos/:id', (req, res) => {
	var id = req.params.id;
	var body = _.pick(req.body, ['text', 'completed']);

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).send();
	}

	if (_.isBoolean(body.completed) && body.completed) {
		body.completedAt = new Date().getTime();
	} else {
		body.completed = false;
		body.completedAt = null;
	}

	Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
		if(!todo) {
			return res.status(404).send();
		}

		res.send({todo});
	}).catch((err) => {
		res.status(400).send();

	});
});

// POST /users

app.post('/users', (req, res) => {
	var body = _.pick(req.body, ['email', 'password']);
	// var user = new User({
	// 	email: body.email,
	// 	password: body.password
	// });
	// This is better.
	var user = new User(body);

	// User.findByToken
	// user.generateAuthToken

	user.save().then(() => {
		return user.generateAuthToken();
		// res.send(doc);
	}).then((token) => {
		res.header('x-auth', token).send(user);
	}).catch((e) => {
		res.status(400).send(e);
	});
});

app.listen(port, () => {
	console.log(`Started on port ${port}`);
});


module.exports = {app};