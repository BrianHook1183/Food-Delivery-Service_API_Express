const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

function bodyIsValid(req, res, next) {
  const dish = req.body.data;
  const { name, description, price, image_url } = dish;
  if (!dish) {
    return next({
      status: 400,
      message: "Dish is empty",
    });
  }
  if (!name) {
    return next({
      status: 400,
      message: "Dish must include a name",
    });
  }
  if (!description) {
    return next({
      status: 400,
      message: "Dish must include a description",
    });
  }
  if (!Number.isInteger(price) || price < 0) {
    return next({
      status: 400,
      message: "Dish must have a price that is an integer greater than 0",
    });
  }
  if (!price) {
    return next({
      status: 400,
      message: "Dish must include a price",
    });
  }
  if (!image_url) {
    return next({
      status: 400,
      message: "Dish must include a image_url",
    });
  }

  const newDish = { ...dish, id: nextId() };
  res.locals.newDish = newDish;
  next();
}

function list(req, res) {
  res.json({ data: dishes });
}

function create(req, res) {
  const { newDish } = res.locals;
  dishes.push(newDish);
  res.status(201).json({ data: newDish });
}

function read(req, res) {
  res.json("read");
}

function update(req, res) {
  res.json(res.locals.newDish);
}

module.exports = {
  list,
  create: [bodyIsValid, create],
  read,
  update: [bodyIsValid, update],
};
