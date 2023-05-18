const video = document.getElementById('video');
const profile_cont = document.getElementById('profile_wrap');

axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

Promise.all([
  faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
]).then(startWebcam);

let videoStream;
function startWebcam() {
   navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: false,
    })
    .then((stream) => {
        videoStream = stream
      video.srcObject = stream;
    })
    .catch((error) => {
      console.error(error);
    });
}

// Function to stop the webcam
function stopWebcam() {
  if (videoStream && videoStream.getTracks) {
    videoStream.getTracks().forEach(track => {
      track.stop(); // Stop each media stream track
    });
  }
}


async function getLabeledFaceDescriptions() {
    const all_images = await axios({
        method: 'get',
        url: 'http://127.0.0.1:8000/api/get-users',
        withCredentials: false,
    }).then((res) => {
        console.log(res.data)
        return res.data
    }).catch((er) => {
        console.log(er);
    })

    return Promise.all(
        all_images.map(async (label) => {
          const descriptions = [];
          for (let i = 0; i < label.image.length; i++) {
            const img = await faceapi.fetchImage(label.image[i]);
            const detections = await faceapi
              .detectSingleFace(img)
              .withFaceLandmarks()
              .withFaceDescriptor();
            descriptions.push(detections.descriptor);
          }
          return new faceapi.LabeledFaceDescriptors(label.id.toString(), descriptions);
        })
    );
}



let startInterVal;
let canvas;
var users = new Set();
video.addEventListener("play", async () => {
  const labeledFaceDescriptors = await getLabeledFaceDescriptions();
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);
   canvas = faceapi.createCanvasFromMedia(video);
  document.querySelector('.video_wrapper').append(canvas);

  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);



  async function matchFaces (){
    const detections = await faceapi
      .detectAllFaces(video)
      .withFaceLandmarks()
      .withFaceDescriptors();

    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

    const results = resizedDetections.map((d) => {
      return faceMatcher.findBestMatch(d.descriptor);
    });
      // console.log(results)
    results.forEach((result, i) => {
      users.add(result.label);
      const box = resizedDetections[i].detection.box;
      const drawBox = new faceapi.draw.DrawBox(box, {
        label: result,
      });
      drawBox.draw(canvas);
    });
  }
  startInterVal = setInterval(matchFaces, 100)
});






var olduser = 0;
let reqInterVal;
reqInterVal = setInterval( () => {
  // console.log('users')
    if (users.size != olduser) {
        olduser = users.size
        let userId = [];
        for (const item of users) {
            const pattern = /^[0-9]$/;
            if (pattern.test(item)) {
                userId.push(Number(item))
            }
        }

        axios.post(`/api/get-user`, {ids: userId})
        .then( (res) => {
            console.log(res.data);
            // clearInterval(startInterVal)
            clearInterval(reqInterVal)
        })
        .catch((err) => {
            console.log(err);
        })
    }
}, 1000)