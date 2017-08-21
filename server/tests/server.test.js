const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
	_id: new ObjectID(),
	text: 'First test todo'
}, {
	_id: new ObjectID(),
	text: 'Second test todo',
	completed: true,
	completedAt: 333
}];

beforeEach((done) => {
	Todo.remove({}).then(() => {
		return Todo.insertMany(todos);
	}).then(() => done());
});

describe('POST /todos', () => {
	it('should create a new todo', (done) => {
		var text = 'Test todo text';

		request(app)
			.post('/todos')
			.send({text})
			.expect(200)
			.expect((res) => {
				expect(res.body.text).toBe(text);
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Todo.find({text}).then((todos) => {
					expect(todos.length).toBe(1);
					expect(todos[0].text).toBe(text);
					done();
				}).catch((e) => done(e));
			});
	});
			it('should not create todo with invalid body data', (done) => {
				request(app)
					.post('/todos')
					.send({})
					.expect(400)
					.expect((res) => {
						expect(res.body.text).toBe();
					})
					.end((err, res) => {
						if (err) {
							return done(err);
						}

						Todo.find().then((todos) => {
							expect(todos.length).toBe(2);
							done();
						}).catch((e) => done(e));
					});
			});

			describe('GET /todos', () => {
				it('should get all todos', (done) => {
					request(app)
						.get('/todos')
						.expect(200)
						.expect((res) => {
							expect(res.body.todos.length).toBe(2);
						})
						.end(done);
				});
			})



	// request post send empty obj. expect 400 use same format. Database assumption length = 0.
	describe('GET /todos/:id', () => {
		it('should return todo doc', (done) => {
			request(app)
			.get(`/todos/${todos[0]._id.toHexString()}`)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(todos[0].text);
			})
			.end(done);
		});

		it('should return 404 if todo not found', (done) => {
			request(app)
			.get(`/todos/${new ObjectID().toHexString()}`)
			.expect(404)
			.end(done);
			// Make a request using an objectID.
			// Call its tohexstring method.
			// It should be a valid id but not in the collection.
			// only expectation is status code.
			// make sure you get a 404 back.
		});

		it('should return 404 for non-object ids', (done) => {
			request(app)
			.get(`/todos/123`)
			.expect(404)
			.end(done);
			// /todos/123
			// should fail and trigger a 404.
			// a 404 status code is expected.
		});
	});

	describe('DELETE /todos/:id', () => {
		it('should remove a todo', (done) => {
			var hexId = todos[1]._id.toHexString();

			request(app)
				.delete(`/todos/${hexId}`)
				.expect(200)
				.expect((res) => {
					expect(res.body.todo._id).toBe(hexId);
				})
				.end((err, res) => {
					if (err) {
						return done(err);
					}

					Todo.findById(hexId).then((todo) => {
						expect(todo).toNotExist();
						done();
					}).catch((err) => done(err));

					// query database using findById toNotExist
					// expect(null).toNotExist(); - Pass in todo arg instead of null.
						// if err, catch error.
				});
		});

		it('should return 404 if todo not found', (done) => {

			var hexId = new ObjectID().toHexString();

			request(app)
			.delete(`/todos/${hexId}`)
			.expect(400)
			.end(done);			
		});

		it('should return 404 if object id is invalid', (done) => {
			request(app)
			.delete(`/todos/123`)
			.expect(404)
			.end(done);
		});
	});

	describe('PATCH /todos/:id', () => {
		it('should update the todo', (done) => {
			// grab id of first item
			console.log(todos[0].text);
			var hexId = todos[0]._id.toHexString();
			var text = 'Some new text';

			request(app)
			.patch(`/todos/${hexId}`)
			.send({
				completed: true,
				text
			})
			.expect(200)
			.expect((res) => {
					expect(res.body.todo.text).toBe(text);
					expect(res.body.todo.completed).toBe(true);
					expect(res.body.todo.completedAt).toBeA('number');
				})
			.end(done);
			// update text, set completed to true
			// assert you get 200 back.
			// text is changed, compelted is true, completedAt is a number. .toBeA
		});

		it('should clear completedAt when todo is not completed', (done) => {
			var hexId = todos[1]._id.toHexString();
			var text = 'Some new text';

			request(app)
			.patch(`/todos/${hexId}`)
			.send({
				text,
				completed: false
			})
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(text);
				expect(res.body.todo.completed).toBe(false);
				expect(res.body.todo.completedAt).toNotExist();
			})
			// grab id of second todo item
			// update text, set completed to false
			// 200
			// text is changed, completed false, completedAt is null .toNotExist
			.end(done);
		});
	});

});