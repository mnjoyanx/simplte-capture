const start = document.getElementById('start')
const stop = document.getElementById('stop')
const videoelem = document.getElementById('video')
const timeSelector = document.getElementById('time')
let stream

 const options = {
     video: {
         width: 400,
         height: 300
        },  
     audio: true
    }

async function fnc() {
    let options = { mimeType: "video/webm;codecs=vp9,opus" };
    stream = new MediaDevices(options)
}   
start.addEventListener('click', async () => {
    startCapture()
})

stop.addEventListener('click', () => {
    stopCapture()
})



async function startCapture() {
        let c = 0

    
    try {
        videoelem.srcObject = await navigator.mediaDevices.getDisplayMedia(options)
        video.onloadedmetadata = function() {
            video.play();
            let b = setInterval(() => {
        c++
        timeSelector.textContent = c
    }, 1000)
  };
    }
    catch (err) {
        console.log(err);
    }
}

async function stopCapture() {
    let tracks = videoelem.srcObject.getTracks()

    tracks.forEach(track => track.stop())

    videoelem.srcObject = null
}
