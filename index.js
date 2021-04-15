let mediaRecorder;
let recordedBlobs;

const recordedVideo = document.querySelector('video#recorded');
const recordButton = document.querySelector('button#record');
const downloadButton = document.querySelector('button#download');

const startMain = document.getElementById('start-main')
const modal = document.getElementById('modal')
const actions = document.getElementById('action')
const deleteBtn = document.getElementById('delete-btn')
const recordMain = document.getElementById('record-main')

recordButton.addEventListener('click', () => {
    if (recordButton.textContent === 'Record') {
        startRecording();
    } else {
        stopRecording();
        recordButton.textContent = 'Record';
        downloadButton.disabled = false;
    }
});




downloadButton.addEventListener('click', () => {
    const blob = new Blob(recordedBlobs, { type: 'video/mp4' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'test.mp4';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    // }, 100);
});

function handleDataAvailable(event) {
    console.log('handleDataAvailable', event);
    if (event.data && event.data.size > 0) {
        console.log('ev da', event.data)
        recordedBlobs.push(event.data);
    }
}

function startRecording() {
    startMain.classList.add('hidden')
    modal.classList.remove('hidden')
    recordMain.classList.remove('hidden')

    if (recordedVideo.src != 'null') {
        recordedVideo.src = null;

        // recordedVideo.srcObject = null;
        recordedVideo.classList.add('hidden')

    }
    recordedBlobs = [];
    let options = { mimeType: 'video/webm;codecs=vp9,opus' };
    try {
        mediaRecorder = new MediaRecorder(window.stream, options);
    } catch (e) {
        console.error('Exception while creating MediaRecorder:', e);
        return;
    }

    console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
    recordButton.textContent = 'Stop Recording';
    downloadButton.disabled = true;
    mediaRecorder.onstop = (event) => {
        console.log('Recorder stopped: ', event);
        console.log('Recorded Blobs: ', recordedBlobs);
    };
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start();
    console.log('MediaRecorder started', mediaRecorder);
}

async function stopRecording() {
    startMain.classList.remove('hidden')
    mediaRecorder.stop();
    actions.classList.remove('hidden')
    modal.classList.add('hidden')

    setTimeout(() => {
        recordedVideo.classList.remove('hidden')
        const superBuffer = new Blob(recordedBlobs, { type: 'video/webm' });
        recordedVideo.src = null;
        recordedVideo.srcObject = null;
        recordedVideo.src = window.URL.createObjectURL(superBuffer);
        recordedVideo.controls = true;
        recordedVideo.play();

    }, 100)


}

function handleSuccess(stream) {
    recordButton.disabled = false;
    console.log('getUserMedia() got stream:', stream);
    window.stream = stream;

    startRecording()
        // const gumVideo = document.querySelector('video#gum');
        // gumVideo.srcObject = stream;
}

async function init(constraints) {

    try {
        const stream = await navigator.mediaDevices.getDisplayMedia(constraints);
        handleSuccess(stream);
    } catch (e) {
        console.error('navigator.getUserMedia error:', e);
    }
}

document.querySelector('button#start').addEventListener('click', async() => {
    const constraints = {
        video: {
            width: 500,
            height: 400
        }
    };
    await init(constraints);
});

deleteBtn.addEventListener('click', () => {
    // recordedVideo.classList.add('hidden')
    // const superBuffer = new Blob(recordedBlobs, { type: 'video/webm' });
    recordedVideo.src = null;
    recordedVideo.srcObject = null;
    recordMain.classList.add('hidden')
    actions.classList.add('hidden')
        // recordedVideo.src = window.URL.createObjectURL(superBuffer);
        // recordedVideo.controls = true;
        // recordedVideo.play();
})