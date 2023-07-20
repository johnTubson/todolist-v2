const Joi = require("joi");
const mongoose = require("mongoose");
const AppError = require("./../util/appError");
const ParamError = require("./../util/paramError");

// list_id validator
async function validate_ObjectId(object_id) {
  const result = mongoose.Types.ObjectId.isValid(object_id);
  return result;
}

// list_name validator
async function validate_list_name(list_name) {
  const schema = Joi.string().min(1).empty(" ").max(255).required().messages({
    "string.base": `"List name" should be a type of 'text'`,
    "string.empty": `"List name" cannot be an empty field`,
    "string.min": `"List name" should have a minimum length of {#limit}`,
    "string.max": "List name cannot exceed {#limit} characters",
    "any.required": `"List name" is a required field`,
  });
  return schema.validateAsync(list_name);
}

// todo string
async function validate_todo(todo) {
  const schema = Joi.string().min(1).empty(" ").max(255).required().messages({
    "string.base": `"Todo" should be a type of 'text'`,
    "string.empty": `"Todo" cannot be an empty field`,
    "string.min": `"Todo" should have a minimum length of {#limit}`,
    "string.max": '"Todo" cannot exceed {#limit} characters',
    "any.required": `"Todo" is a required field`,
  });
  return schema.validateAsync(todo);
}

function listId_validator(medium) {
  if (!medium)
    throw new ReferenceError(
      "Validator medium not specified, medium housing value to be validated required!"
    );
  let spec;
  if (medium === "body") {
    spec = "body";
  } else if (medium === "param" || "params") {
    spec = "params";
  } else {
    throw new Error("Invalid validation medium");
  }
  return async function (req, res, next) {
    const result = await validate_ObjectId(req[spec].list_id);
    if (!result) {
      next(new ParamError("Resource not found", 400));
    }
    next();
    return;
  };
}

function todoId_validator(medium) {
  if (!medium)
    throw new ReferenceError(
      "Validator medium not specified, medium housing value to be validated required!"
    );
  let spec;
  if (medium === "body") {
    spec = "body";
  } else {
    throw new Error("Invalid validation medium");
  }
  return async function (req, res, next) {
    const result = await validate_ObjectId(req[spec].todo_id);
    if (!result) return next(new AppError("Todo not found", 400));
    return next();
  };
}

function listName_validator() {
  return async function (req, res, next) {
    try {
      await validate_list_name(req.body.list_name);
      return next();
    } catch (err) {
      const error = new AppError(err.message, 400);
      return next(error);
    }
  };
}

function todo_validator() {
  return async function (req, res, next) {
    try {
      await validate_todo(req.body.todo);
      return next();
    } catch (err) {
      const error = new AppError(err.message, 400);
      next(error);
      return;
    }
  };
}

module.exports = {
  listId_validator,
  listName_validator,
  todo_validator,
  todoId_validator,
  validate_ObjectId,
};
