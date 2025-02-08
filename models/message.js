const messages = [];
module.exports = {
  fetchAll:() => messages.sort((a, b) => new Date(b.date) - new Date(a.date)),
  addMessage:(content, user) => {
    const now = new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const date_time = `${days[now.getDay()]}, ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    const msg = {"sender": user, "content": content, "date": date_time, "id": messages.length + 1}
    messages.push(msg);
  },
  searchMessage: (content) => {
    return messages.filter(msg => msg.content.includes(content)).sort((a, b) => new Date(b.date) - new Date(a.date));
  },
  editMessage:(msg_id, new_content, user) => {
    const msg = messages.find(msg => msg.id == msg_id && msg.sender.Email === user.Email);
    msg.content = new_content;
    const now = new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const date_time = `${days[now.getDay()]}, ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    msg.date = date_time;
  },
  deleteMessage:(msg_id, user) => {
    const index = messages.findIndex(msg => msg.id == msg_id && msg.sender.Email === user.Email);
    if (index !== -1)
        messages.splice(index, 1);
  }
};