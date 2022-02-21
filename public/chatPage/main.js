let socket = io()
let messageForm = document.getElementById('send-message__form')
let messageInput = document.getElementById('send-message__input')
let messageList = document.getElementById('message__list')

const userName = 'test' // Need to get it from login form or jwt somehow

socket.emit('user name', userName)

const addMessage = (message, sentByUser=false,newConnectOrDisconnect=false)=>{
    let item = document.createElement('li')
    item.textContent = message
    if(sentByUser){
        item.classList.add('sent-by-user')
    } else if(newConnectOrDisconnect){
        item.classList.add('user-connect-or-disconnect')
    }
    messageList.appendChild(item)
    window.scrollTo(0,document.body.scrollHeight)
}

messageForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    try{    
        let message = messageInput.value
        socket.emit('chat message',message)
        messageInput.value = ''
        // Need to add message to the message list with class sent by user
        addMessage('You: '+ message,true)

    } catch(err){
        console.log(err)
    }
   
})

socket.on('new user', userName=>{
    addMessage(`${userName} has entered the chat`,false,true)
})

socket.on('user left',userName=>{
    addMessage(`${userName} has left the chat`,false,true)
})

socket.on('chat message', (msg)=>{
    addMessage( msg)
})