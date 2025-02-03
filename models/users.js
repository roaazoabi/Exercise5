const users = [];
module.exports = {
  getUsers: () => users,
  addUser: (user) => users.push(user),
};