const List = require("./list");
const User = require("./user");
const Item = require("./items");

List.belongsTo(User,{
    foreignKey:"user_id",
    onDelete: "CASCADE"
})
List.hasMany(Item,{
    foreignKey:"item_id",
    onDelete: "CASCADE"
})
Item.belongsTo(User,{
    foreignKey:"user_id",
    onDelete:"CASCADE"
})
module.exports = {List, User, Item}