const messages = [];
module.exports = {
  fetchAll:() =>  messages.reverse(),
  addMessage:(content, user) => {
    const now = new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const date_time = `${days[now.getDay()]}, ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const msg = {"sender": user, "content": content, "date": date_time, "id": messages.length + 1}
    messages.push(msg);
  },
  searchMessage: (content) => {
    return messages.filter(msg => msg.content.includes(content)).reverse();
  },
  editMessage:(msg, new_content, user) => {
    
  },
  deleteMessage:(msg, user) => {

  }
};