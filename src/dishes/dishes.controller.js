const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

function list(req, res) {
  res.json("list");
}

function create(req, res) {
  res.json("create");
}

function read(req, res) {
  res.json("read");
}

function update(req, res) {
  res.json("update");
}

module.exports = {
  list,
  create,
  read,
  update,
};
