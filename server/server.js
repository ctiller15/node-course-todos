var express = require('express');
var bodyParser = require('body-parser');
// var {ObjectID} = require('mongoose');

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

	// if (!ObjectID.isValid(id)){
	// 	return res.status(404).send();
	// }

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
	// validate id using isValid
		// if not valid, 404 - send back empty body

	// findById
		// success
			// if todo - send it back
			// if no todo - send back 404 with empty body
		// error
			// 400 - not valid - send back nothing
});


app.listen(port, () => {
	console.log(`Started on port ${port}`);
});


module.exports = {app};