const video = document.getElementById('video');
axios.defaults.headers.common['Content-Type'] = 'application/json';

Promise.all([
  faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
]).then(startWebcam);


function startWebcam() {
	navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: false,
    })
    .then((stream) => {
      video.srcObject = stream;
    })
    .catch((error) => {
      console.error(error);
    });
}



async function getLabeledFaceDescriptions() {
  const labels = ["bipu", "messi", "naimur"]; //static user names as image dir
  axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
	const all_images = await axios({
		method: 'get',
		url: 'http://127.0.0.1:8000/api/get-users',
		withCredentials: false,
		}).then((res) => {
			return res.data
		}).catch((er) => {
			console.log(er);
		})
		
		
		const temp_images = [
			{
				"id": 1,
				"image": [
					"https://avatars.githubusercontent.com/u/61359218",
					"https://avatars.githubusercontent.com/u/61359218",
				]
			}
		]
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
  startInterVal = setInterval(matchFaces, 100)
});

var olduser = 0;
setInterval( () => {
  // console.log('users')
  if (users.size != olduser) {
    olduser = users.size
    console.log(users)
    // clearInterval(startInterVal)
  }
}, 1000)
