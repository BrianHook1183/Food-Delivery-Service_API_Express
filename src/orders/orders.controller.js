const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

function read(req, res) {
  res.json("read");
}
function update(req, res) {
  res.json("update");
}
function destroy(req, res) {
  res.json("delete");
}
function list(req, res) {
  res.json({data: orders});
}
function create(req, res) {
  res.json("create");
}

module.exports = {
  read,
  update,
  destroy,
  list,
  create,
};
