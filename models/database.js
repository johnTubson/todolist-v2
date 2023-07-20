// IMPLEMENT DEFAULT VALIDATOR

const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
    todo: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 255
    },

    date_added: {
        type: Date,
        default : Date.now(),
    },
    completed: {
        type: Boolean,
        default: false
    },
    deleted: {
        type: Boolean,
        default: false
    }
});


const listSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 255,
        unique: true,
    },
    todos: [todoSchema],
    date_created: {
        type: Date,
        default : Date.now(),
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    complete_all: {
        type: Boolean,
        default: false,
    }


});

listSchema.pre("save", async function () {
    const todoState = this.todos.every((todo) => todo.completed === true );
    this.complete_all = todoState ? true : false ;
});


const todo1 = {
    todo: "Welcome to your todolist!"
};
const todo2 = {
    todo: "Hit the + button to add a new item."
};
const todo3 = {
    todo: "To delete a todo, hit the delete icon ",
};
const defaultItems = [todo1, todo2, todo3];

listSchema.pre("save", async function() {
    if(!(this.todos.length > 0)) {
       this.todos.push({$each: defaultItems, $position: 0});
    }
});

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 255
    },
    last_name: {
        type: String,
        minLength: 1,
        maxLength: 255
    },
    google_id: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 255
    },
    default_list: {
        type: mongoose.Schema.Types.ObjectId,
    }
});




const User = mongoose.model("user", userSchema);

if (!User.schema.options.toObject) {
    User.schema.options.toObject = {};
  }
  User.schema.options.toObject.transform = function (doc, ret, options) {
    return {
      _id: ret._id,
      name: ret.name,
      google_id: ret.google_id,
      default_list: ret.default_list,
    };
  }

const List = mongoose.model("list", listSchema);


module.exports = {List, User};

