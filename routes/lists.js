const Router = require("express").Router();
const {authenticate} = require("../middlewares/authenticator");
const {listId_validator, listName_validator, todoId_validator, todo_validator, validate_ObjectId } = require("../middlewares/validator");
const {getLists, deleteList, createList, completeList, default_list, deleteTodo, completeTodo, addTodo} = require("../controllers/lists");
const ParamError = require("../util/paramError");



/* * On entry to the app, unathenticated users are greeted with the homepage
   * The homepage will consist of a description of the website and a sign in with Google functionality
   * On successful authentication User is redirected back to the lists page where Default todo list is displayed 

*/





// Lists

Router.all("*", authenticate);

Router.get("/", getLists);



// List functionalities

Router.post("/delete", listId_validator("body"), deleteList);

Router.post("/create", listName_validator(), createList);

Router.post("/complete", listId_validator("body"), completeList);

Router.post("/default", listId_validator("body"), default_list)


//Todos

Router.param("list_id", async function (req, res, next, list_id) {
   const result = await validate_ObjectId(list_id);
   if (!result)  {
      next(new ParamError("List not found", 400));
      return;
   };
   next();
})

Router.get("/:list_id/", getLists);


// Todo functionalities


Router.post("/:list_id/delete", todoId_validator("body"), deleteTodo);

Router.post("/:list_id/complete", todoId_validator("body"), completeTodo);

Router.post("/:list_id/add", todo_validator(), addTodo);



module.exports = Router;