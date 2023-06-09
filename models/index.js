const List = require("./list");
const User = require("./user");
const Item = require("./items");

List.belongsTo(User);
User.hasMany(List);

List.hasMany(Item);
Item.belongsTo(List);

module.exports = { List, User, Item };
