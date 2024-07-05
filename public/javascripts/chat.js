
// to scroll to the end of the page
window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }) 

// send msg with enter key
document.getElementById("msg").addEventListener("keyup", function(e) {
    if (e.key == 'Enter') {
        document.getElementById("sendBtn").click();
    }
});