const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

function orderIdExists(req, res, next) {
  const { orderId } = req.params;

  const foundIndex = orders.findIndex((order) => order.id == orderId);
  if (foundIndex >= 0) {
    res.locals.foundOrder = { index: foundIndex, order: orders[foundIndex] };
    next();
  } else {
    return next({
      status: 404,
      message: `Order does not exist: ${orderId}.`,
    });
  }

  const order = req.body.data;
  if (order) {
    if (order.id && orderId !== order.id) {
      return next({
        status: 400,
        message: `Order id does not match route id. Order: ${order.id}, Route: ${orderId}`,
      });
    }
  }
}

function bodyIsValid(req, res, next) {
  const { orderId } = req.params;
  const order = req.body.data;
  const { deliverTo, mobileNumber, status, dishes } = order;

  // if (order.id && orderId !== order.id) {
  //   return next({
  //     status: 400,
  //     message: `Order id does not match route id. Order: ${order.id}, Route: ${orderId}`,
  //   });
  // }

  if (!deliverTo) {
    return next({
      status: 400,
      message: "Order must include a deliverTo",
    });
  }
  if (!mobileNumber) {
    return next({
      status: 400,
      message: "Order must include a mobileNumber",
    });
  }
  if (!dishes) {
    return next({
      status: 400,
      message: "Order must include a dish",
    });
  }
  if (!Array.isArray(dishes) || dishes.length === 0) {
    return next({
      status: 400,
      message: "Order must include at least one dish",
    });
  }

  for (let i = 0; i < dishes.length; i++) {
    const dish = dishes[i];
    if (
      !dish.quantity ||
      !Number.isInteger(dish.quantity) ||
      !dish.quantity > 0
    ) {
      return next({
        status: 400,
        message: `Dish ${i} must have a quantity that is an integer greater than 0`,
      });
    }
  }

  // Adds new id for creating order but doesn't if updating and id not in body
  let handleId = undefined;
  if (order.id === undefined && orderId) {
    handleId = { id: orderId };
  } else {
    handleId = orderId ? { id: orderId } : { id: nextId() };
  }
  //TODO need to adjust this for having dishes array embedded - and says "Note: Each dish in the Order's dishes property is a complete copy of the dish, rather than a reference to the dish by id. This is so the order does not change retroactively if the dish data is updated some time after the order is created."
  const newOrder = { ...order, ...handleId };
  res.locals.newOrder = newOrder;
  next();
}

function read(req, res) {
  res.json({ data: res.locals.foundOrder.order });
}
function update(req, res) {
  res.json("update");
}
function destroy(req, res) {
  res.json("delete");
}
function list(req, res) {
  res.json({ data: orders });
}
function create(req, res) {
  const { newOrder } = res.locals;
  orders.push(newOrder);
  res.status(201).json({ data: newOrder });
}

module.exports = {
  read: [orderIdExists, read],
  update: [orderIdExists, bodyIsValid, update],
  destroy,
  list,
  create: [bodyIsValid, create],
};
