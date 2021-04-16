let mediaRecorder
let recordedBlobs
let timer
let accept = false


const recordedVideo = document.querySelector('video#recorded');
const recordButton = document.querySelector('button#record');
const downloadButton = document.querySelector('button#download');

const startMain = document.getElementById('start-main')
const modal = document.getElementById('modal-record')
const actions = document.getElementById('action')
const deleteBtn = document.getElementById('delete-btn')
const recordMain = document.getElementById('record-main')

const modalSelector = document.getElementById('modal')
const errMessage = document.getElementById('accept-message')
let inputSelector = document.getElementById('isChecked')
const timerSelector = document.getElementById('timer-main')
let first = document.getElementById('first')
let second = document.getElementById('second')
let minute = document.getElementById('minute')
const fiveMinutes = document.getElementById('five-minutes')
let notification = false
const yourRecord = document.getElementById('your-record')
const recordNotification = document.getElementById('record-notification')



    recordButton.addEventListener('click', () => {
    if (recordButton.textContent === 'Record') {
        startRecording();
    } else {
        recordButton.textContent = 'Record';
        yourRecord.classList.remove('hidden')
    }
});



downloadButton.addEventListener('click', () => {
    const blob = new Blob(recordedBlobs, { type: 'video/mp4', audio: true });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'test.mp4';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

});

function handleDataAvailable(event) {
    console.log('handleDataAvailable', event);
    if (event.data && event.data.size > 0) {
        console.log('ev da', event.data)
        recordedBlobs.push(event.data);
    }
}

 function recordBlob() {
    recordedBlobs = [];
    let options = { mimeType: 'video/webm;codecs=vp9,opus' };
    try {
        mediaRecorder = new MediaRecorder(window.stream, options);
    } catch (e) {
        console.error('Exception while creating MediaRecorder:', e);
        return;
    }

    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start();
}

function startRecording() {

    timerSelector.classList.remove('hidden')
    startMain.classList.add('hidden')
    modal.classList.remove('hidden')
    recordMain.classList.remove('hidden')
    actions.classList.add('hidden')

    if (recordedVideo.src != 'null') {
        recordedVideo.classList.add('hidden')
    }
    recordBlob()
    timerFn()

    recordButton.innerText = ''
    let stopSpan = document.createElement('span')
    stopSpan.classList.add('right-space')
    stopSpan.textContent = 'Stop Recording'
    recordButton.append(stopSpan)
    const stopIcon = document.createElement('i')

    stopIcon.classList.add('fa')
    stopIcon.classList.add('fa-stop-circle')
    recordButton.insertBefore(stopIcon, stopSpan)
    
    stopFn()
}

async function stopFn(timer) {
    clearInterval(timer)
}

recordButton.addEventListener('click', async () => {
    startMain.classList.remove('hidden')
    mediaRecorder.stop();
    actions.classList.remove('hidden')
    modal.classList.add('hidden')

    setTimeout(async () => {
        recordedVideo.classList.remove('hidden')
        const superBuffer = new Blob(recordedBlobs, { type: 'video/webm' });
        recordedVideo.src = window.URL.createObjectURL(superBuffer);
        recordedVideo.controls = true;
        recordedVideo.play();
        stopTrack()

    }, 100)


})


function handleSuccess(stream) {
    window.stream = stream;
      stream.getVideoTracks()[0].onended = function () {
          recordButton.click()
      };
    
    startRecording()
}

async function init(constraints) {
    let stream = await navigator.mediaDevices.getDisplayMedia(constraints);
    try {
        
        if (stream) {
            handleSuccess(stream);            
        } else return

    } catch (e) {
        console.error('navigator.getUserMedia error:', e);
        return
    }
}

document.querySelector('button#start').addEventListener('click', async () => {
    modalSelector.classList.remove('hidden')

    inputSelector.checked = false
    const constraints = {
        video: {
            width: 500,
            height: 400,
        },
        audio: true
    };


    let startRecording = document.getElementById('start-recording')
    
    startRecording.addEventListener('click', async () => {
        if (inputSelector.checked) {
            modalSelector.classList.add('hidden')
            await init(constraints);
        } else {
            errMessage.classList.remove('hidden')
        }
    })
});

deleteBtn.addEventListener('click', () => {
    recordedVideo.classList.add('hidden')
    const superBuffer = new Blob(recordedBlobs, { type: 'video/webm' });
    recordedVideo.src = null;
    recordedVideo.srcObject = null;
    recordMain.classList.add('hidden')
    actions.classList.add('hidden')
    recordedVideo.src = window.URL.createObjectURL(superBuffer);
    recordedVideo.controls = true;
    yourRecord.classList.add('hidden')
})


const b = arr => {
    return `${arr[0]}:${arr[1]}${arr[2]}`
}

function timerFn() {
    let _t = [0, 0, 0]

    timer = setInterval(async () => {
        const time = +_t.join('')
        fiveMinutes.classList.remove('hidden')
        if (time >= 500) {
            stopFn(timer)
            _t = [0, 0, 0]
            
            stopTrack()
            recordButton.click()
            recordNotification.classList.remove('hidden')
            return 
        }
        _t[2]++

        if (_t[2] === 10) {
            _t[2] = 0
            _t[1]++
        }

        if (_t[1] === 6) {
            _t[1] = 0
            _t[0]++
        }
        
        minute.textContent = b(_t)
    },10)

}


async function stopTrack() {
    let b = await mediaRecorder.stream.getVideoTracks()[0]
    b.stop()
}