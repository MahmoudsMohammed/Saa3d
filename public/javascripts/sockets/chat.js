
let sendBtn = document.getElementById('sendBtn');

socket.on('connect', () =>{
    const chatId = document.getElementById('chatId').value;
    socket.emit('joinChatRoom', chatId);
})

sendBtn.onclick = (e) =>{
    let msg = document.getElementById('msg');
    if(msg.value) {
        const chatId = document.getElementById('chatId').value;
        currentUserId = document.getElementById('currentUser').value;
        message = {
            content: msg.value,
            sender: currentUserId,
            time: Date.now()
        };
        msg.value = '';
        socket.emit('newMsg', chatId, message);
    }
};

socket.on('addMsg', msg =>{
    let messages = document.getElementById('messages');
    currentUserId = document.getElementById('currentUser').value;
    let newMsg = '';
   if(msg.sender == currentUserId){
    newMsg = `<div class="d-flex flex-row justify-content-end">
    <div>
        <p class="small p-2 me-3 mb-1 text-white rounded-3 bg-primary"><span class="h6">${msg.content}</span></p>
        <p class="small rounded-3 text-muted text-end mx-4">${new Date(msg.time).toLocaleString()}</p>
    </div>
    </div>`;
   }
    else{
        newMsg = `<div class="d-flex flex-row justify-content-start">
        <div>
            <p class="small p-2 ms-3 mb-1 rounded-3 text-white bg-secondary"><span class="h6">${msg.content}</span></p>
            <p class="small rounded-3 text-muted text-start mx-4">${new Date(msg.time).toLocaleString()}</p>
        </div>
        </div>`;
    }    
    messages.innerHTML += newMsg;
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
})
