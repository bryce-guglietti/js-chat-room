const socket = io('https://lit-ridge-77524.herokuapp.com/');
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');



//get username and room
const {username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

socket.emit('joinRoom', {username, room});

//Get room and users
socket.on('roomUsers', ({room, users})=>{
    outputRoomName(room);
    outputUsers(users);

});

//message from server
socket.on('message', message=>{
    console.log(message);
    outputMessage(message);

    //Scroll down function
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Submitted Message
chatForm.addEventListener('submit', (e)=>{
    e.preventDefault();

    //GET message
    const msg = e.target.elements.msg.value;

    //Emit Message to server
    socket.emit('chatMessage', msg);

    //clearing input
    e.target.elements.msg.value ='';
    e.target.elements.msg.focus();

})

//Output Message to DOM
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

//Output room name
function outputRoomName(room){
    roomName.innerText = room;
}

//output room users
function outputUsers(users){
    userList.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`
}