import { io } from '../app.js';
let user;
let chatBox = document.getElementById('chatBox');

Swal.fire({
    title: "Identificación",
    input: "text",
    text: "Ingresa su nombre",
    inputValidator: (value) => {
        return !value && "Debe ingresar su nombre";
    },
    allowOutsideClick: false
}).then(result => {
    user = result.value;

    io.emit('authenticate');

    io.on('messageLogs', data => {
        let log = document.getElementById("messageLogs");
        let messages = "";
        data.forEach(message => {
            messages = messages + `${message.user} dice: ${message.message}</br>`;
        });
        log.innerHTML = messages;
    });

    io.on('userConnected', data => {
        Swal.fire({
            text: "Usuario nuevo",
            toast: true,
            position: "top-right"
        });
    });
});

chatBox.addEventListener('keyup', evt => {
    if (evt.key === "Enter") {
        if (chatBox.value.trim().length > 0) {
            socket.emit("message", { user: user, message: chatBox.value });
            chatBox.value = "";
        }
    }
});



