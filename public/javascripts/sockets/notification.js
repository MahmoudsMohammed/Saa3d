const socket = io();

let notifyBtn = document.getElementsByClassName('notify');
const notfNum = document.getElementsByClassName('notfNum')[0];

socket.on('connect', () =>{
    currentUserId = document.getElementById('currentUser').value;
    socket.emit('joinNotfsRoom', currentUserId);
})

for (let btn of notifyBtn) {
        btn.onclick = (e) =>{
            socket.emit('newNotf', btn.value);
        };
}    

socket.on('addNotf', () => {
    notfNum.innerHTML = Number(notfNum.innerHTML) + 1;  
    notfNum.style.display = "block";  
})