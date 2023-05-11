const video = document.getElementById('video');


Promise.all([
  faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
]).then(startWebcam);


function startWebcam() {
	// navigator.mediaDevices
  //   .getUserMedia({
  //     video: true,
  //     audio: false,
  //   })
  //   .then((stream) => {
  //     video.srcObject = stream;
  //   })
  //   .catch((error) => {
  //     console.error(error);
  //   });
  video.src = "./assets/video/vdemo.mp4"
    video.addEventListener('loadedmetadata', function() {
    this.currentTime = 50;
  }, false);
}



function getLabeledFaceDescriptions() {
  // const labels = ["bipu", "messi", "naimur", "amy", "bernadette", "howard", "leonard", "penny", "raj", "sheldon", "stuart"]; //static user names as image dir
  const labels = ["bipu", "messi", "naimur"]; //static user names as image dir
  return Promise.all(
    labels.map(async (label) => {
      const descriptions = [];
      for (let i = 1; i <= 2; i++) {
        const img = await faceapi.fetchImage(`./assets/users/${label}/${label}${i}.png`);
        const detections = await faceapi
          .detectSingleFace(img)
          .withFaceLandmarks()
          .withFaceDescriptor();
        descriptions.push(detections.descriptor);
      }
      // console.log(descriptions);
      return new faceapi.LabeledFaceDescriptors(label, descriptions,);
    })
  );
}


var users = new Set();
video.addEventListener("play", async () => {
  const labeledFaceDescriptors = await getLabeledFaceDescriptions();
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);

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
  setInterval(matchFaces, 100)
});

var olduser = 0;
setInterval( () => {
  // console.log('users')
  if (users.size != olduser) {
    olduser = users.size
    console.log(users)
  }
}, 1000)
