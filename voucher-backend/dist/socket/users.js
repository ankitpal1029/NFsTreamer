"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersInRoom = exports.getUser = exports.removeUser = exports.addUser = void 0;
const users = [];
const addUser = ({ name, room, id, }) => {
    const existingUser = users.find((user) => user.room == room && user.name == name);
    if (existingUser) {
        return { error: "User already exists in the room" };
    }
    const user = { room, name, id };
    users.push(user);
    return { user };
};
exports.addUser = addUser;
const removeUser = (id) => {
    const index = users.findIndex((user) => user.id == id);
    console.log(id, "has been removed from user");
    if (index !== -1) {
        return { user: users.splice(index, 1)[0] };
    }
    return { error: "User doesn't exist in room" };
};
exports.removeUser = removeUser;
const getUser = (id) => users.find((user) => user.id == id);
exports.getUser = getUser;
const getUsersInRoom = (room) => users.filter((user) => user.room == room);
exports.getUsersInRoom = getUsersInRoom;
//# sourceMappingURL=users.js.map