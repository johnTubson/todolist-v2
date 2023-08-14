const { List, User } = require("../models/database");
const AppError = require("./../util/appError");
const ParamError = require("./../util/paramError");

async function newUserAction(profile) {
	const new_user = new User({
		name: profile.name.givenName,
		last_name: profile.name.familyName,
		google_id: profile.id,
	});

	const new_list = new List({
		name: "Todo list!",
		user_id: new_user._id,
	});

	new_user.default_list = new_list._id;

	try {
		await new_list.save();
	} catch (err) {
		new_user.default_list = null;
		//log error
	}

	const user = await new_user.save();

	return user.toObject();
}

async function getLists(req, res) {
	const lists = await List.find({ user_id: req.user._id });
	res.locals.lists = lists;
	let selected_list = lists.find(list => {
		return list._id.toString() === (req.params.list_id ? req.params.list_id : req.user.default_list);
	});
	if (!selected_list) selected_list = lists[0];
	res.locals.selected_list = selected_list;
	res.locals.default_list = selected_list._id.toString() === req.user.default_list ? true : false;
	res.render("lists");
}

async function createList(req, res) {
	const list_name = req.body.list_name;
	const new_list = new List({
		name: list_name,
		todos: [],
		user_id: req.user._id,
	});
	await new_list.save();
	res.redirect("/lists/" + new_list._id);
}

async function deleteList(req, res) {
	await List.findByIdAndDelete(req.body.list_id);
	res.redirect("/lists");
}

async function completeList(req, res) {
	const list = await List.findById(req.body.list_id);
	if (!list) return new AppError("List not found", 400);
	const operator = req.body.complete_all === "true" ? true : false;

	async function complete_todo(list, operator) {
		list.complete_all = operator;
		list.todos.forEach(todo => {
			todo.completed = operator;
		});
		await list.save();
	}

	list && complete_todo(list, operator);
	res.redirect("/lists/" + req.body.list_id);
}

async function default_list(req, res) {
	const list = req.body.list_id;
	const user = await User.findById(req.user._id);
	if (!user) return new AppError("Unauthorised operation", 401);
	user && (user.default_list = list);
	await user.save();
	req.session.passport.user.default_list = list;
	res.redirect("/lists/" + list);
}

async function addTodo(req, res) {
	const new_todo = {
		todo: req.body.todo,
	};
	const list = await List.findById(req.params.list_id);
	if (!list) return new ParamError("List not found", 400);
	list && list.todos.push(new_todo);
	await list.save();
	res.redirect("/lists/" + req.params.list_id);
}

async function completeTodo(req, res) {
	const list = await List.findById(req.params.list_id);
	if (!list) return new ParamError("List not found", 400);
	const doc = list.todos.id(req.body.todo_id);
	if (!doc) return new AppError("Todo doesn't exist", 400);
	doc && (doc.completed = !doc.completed);
	await list.save();
	res.redirect("/lists/" + req.params.list_id);
}

async function deleteTodo(req, res) {
	const list = await List.findById(req.params.list_id);
	if (!list) return new ParamError("List not found", 400);
	list && list.todos.id(req.body.todo_id).deleteOne();
	await list.save();
	res.redirect("/lists/" + req.params.list_id);
}

module.exports = {
	newUserAction,
	getLists,
	createList,
	deleteList,
	default_list,
	completeList,
	addTodo,
	completeTodo,
	deleteTodo,
};
