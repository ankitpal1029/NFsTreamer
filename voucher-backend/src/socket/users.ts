interface ILiveChatUsers {
  id: string;
  room: string;
  name: string;
}

interface IAddUserReturn {
  user?: ILiveChatUsers;
  error?: string;
}
const users: ILiveChatUsers[] = [];

const addUser = ({
  name,
  room,
  id,
}: {
  name: string;
  room: string;
  id: string;
}): IAddUserReturn => {
  const existingUser = users.find(
    (user) => user.room == room && user.name == name
  );

  if (existingUser) {
    return { error: "User already exists in the room" };
  }

  const user: ILiveChatUsers = { room, name, id };
  users.push(user);

  return { user };
};

const removeUser = (id: string) => {
  const index = users.findIndex((user) => user.id == id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }

  return { error: "User doesn't exist in room" };
};

const getUser = (id: string) => users.find((user) => user.id == id);

const getUsersInRoom = (room: string) =>
  users.filter((user) => user.room == room);

export { addUser, removeUser, getUser, getUsersInRoom };
