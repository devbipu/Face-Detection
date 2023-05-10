const video = document.getElementById('video');


// Promise.all([
//   faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
//   faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
//   faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
// ]).then(startWebcam);


function startWebcam() {
	navigator.mediaDevices.getDisplayMedia({'video': true, audio: false}).then((stream)=> {
	    console.log(stream)
	}).catch((err) => {
		console.error(err);
	})
}

// webcamStart()