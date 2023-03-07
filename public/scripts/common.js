(() => {
  const socket = io();
  const form = document.querySelector('form[name="messages"]'),
    email = form.querySelector('[name="email"]'),
    avatar = form.querySelector('[name="avatar"]'),
    message = form.querySelector('[name="message"]'),
    invalidEmail = form.querySelector('[name="email"] + .invalid-feedback'),
    invalidAvatar = form.querySelector('[name="avatar"] + .invalid-feedback'),
    invalidMsg = form.querySelector('[name="message"] + .invalid-feedback'),
    validateEmail = (email) =>
      String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\.,;:\s@"]+(\.[^<>()[\]\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ),
    validateURL = (url) =>
      !!/^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/.test(
        url
      );
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const vEmail = validateEmail(email.value.trim()),
      vAvatar = validateURL(avatar.value.trim()),
      vMessage = message.value.trim() !== "";
    if (vEmail && vAvatar && vMessage) {
      const data = new FormData(form);
      const values = {};
      for (let entry of data.entries()) {
        values[entry[0]] = entry[1].trim();
      }
      socket.emit("message", values);
      form.querySelector('[name="message"]').value = "";
    }
    invalidEmail.classList[!vEmail ? "add" : "remove"]("d-block");
    invalidAvatar.classList[!vAvatar ? "add" : "remove"]("d-block");
    invalidMsg.classList[!vMessage ? "add" : "remove"]("d-block");
  });
  const buildMessagesList = (messages) => {
    if (messages.length > 0) {
      const container = document.getElementById("messages");
      container.innerHTML = messages
        .map(({ email, avatar, timestamp, message }) => {
          return `<div style="margin-bottom: 6px;"><span style="overflow: hidden; display: inline-block; width: 24px; height: 24px; border-radius: 6px; vertical-align: middle; margin-right: 6px; background-color: #ccc;"><img src="${avatar}" alt="" width="24" height="24"></span><span>${email}</span> <span style="font-weight: bold; color: blue;">${new Date(
            timestamp
          ).toLocaleString()}</span> <span style="font-style: italic; color: green">${message}</span></div>`;
        })
        .join("");
      container.scrollTo(0, container.scrollHeight);
    }
  };
  socket.on("messages", ({ messages }) => {
    buildMessagesList(messages);
  });
})();
