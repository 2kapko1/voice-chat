let socket = io(window.location.origin, {
    transports: ['websocket'],
    upgrade: false
});

function getChannel() {
    return document.querySelector('input[name="channel"]:checked').value;
}


document.getElementById('change_channel').addEventListener('click', () => {
    socket.emit('joinRoom', getChannel());
    document.querySelector('fieldset').style.borderColor = 'red';
})

socket.on('connect', () => {
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then((stream) => {
            var mediaRecorder = new MediaRecorder(stream);
            var audioChunks = [];

            mediaRecorder.addEventListener("dataavailable", function (event) {
                audioChunks.push(event.data);
            });

            mediaRecorder.addEventListener("stop", function () {
                var audioBlob = new Blob(audioChunks);
                audioChunks = [];
                var fileReader = new FileReader();
                fileReader.readAsDataURL(audioBlob);
                fileReader.onloadend = function () {
                    var base64String = fileReader.result;
                    socket.emit("audioStream", base64String);
                };

                mediaRecorder.start();
                setTimeout(function () {
                    mediaRecorder.stop();
                }, 1000);
            });

            mediaRecorder.start();
            setTimeout(function () {
                mediaRecorder.stop();
            }, 1000);
        })
        .catch((error) => {
            console.error('Error capturing audio.', error);
        });
});

socket.on('audioStream', (audioData) => {
    var newData = audioData.split(";");
    newData[0] = "data:audio/ogg;";
    newData = newData[0] + newData[1];

    var audio = new Audio(newData);
    if (!audio || document.hidden) {
        return;
    }
    audio.play();
});