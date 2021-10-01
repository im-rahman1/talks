
const socket = io();

// get userName and roomId from the user
const { username, room } = Qs.parse(window.location.search, {
  ignoreQueryPrefix: true
});

console.log(username, room);

// join chatRoom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
})

// Message from server
socket.on('message', message => {
  // console.log(message);
  outputMessage(message);

  // scroll down
  const chatMessages = document.querySelector('.chat-messages');
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// redirect from createRoom page to joinRoom page or viceVersa
function redirect(param) {
  const value = param;
  if(value === 'createroom'){
    location.href = "createRoom.html";
  }
  else if (value === 'joinroom') {
    location.href = "index.html";
  }
  else if (value === 'permissionGranted') {
    // location.href = "homepage";
  }
}

// collapsible
function collapsible() {
  document.getElementById("collapsible").classList.toggle("expanded");
  hideElements();
}

// used by collapsible() to hide elements
function hideElements() {
  let elementsToHide = document.querySelectorAll(".elementToHide");
  
  elementsToHide.forEach((item) => {
    item.classList.toggle("hide-element");
  })
  // console.log(elementsToHide);
}

// Read messages 
function readMsg() {
  
  let msgElement = document.getElementById('msg');

  // get msg text
  msg = msgElement.value;

  // clear the input after sending it
  msgElement.value = '';
  
  // Emit message to server
  socket.emit('chatMessage', msg);
  // outputMessage(msg);

}

// output message to DOM
function outputMessage(msg) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">  ${msg.username}•<span>${msg.time}</span></p>
  <p class="text">
    ${msg.text}
  </p>`;
  const chatSection = document.getElementById('chat-message');
  chatSection.appendChild(div);
  // console.log(div);
}

//Prompt the user before leave chat room
function leaveRoom() {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  }
}

// Add room name to DOM
function outputRoomName(room) {
  const roomName = document.getElementById('room-name');
  
  roomName.innerHTML = room;
}

// Add users to DOM
function outputUsers(users) {
  const userList = document.getElementById('users');
  
  userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
}