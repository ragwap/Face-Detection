const getImage = document.getElementById("uploadImage");

Promise.all([
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.ssdMobilenetv1.loadFromUri("/models")
]).then(start);

function start() {
  const container = document.createElement("div");
  container.style.position = "relative";
  document.body.append(container);
  document.body.append("Loaded");
  getImage.addEventListener("change", async () => {
    const imageFile = await faceapi.bufferToImage(getImage.files[0]);
    container.append(imageFile);
    const canvas = faceapi.createCanvasFromMedia(imageFile);
    container.append(canvas);
    const displaySize = { width: imageFile.width, height: imageFile.height };
    faceapi.matchDimensions(canvas, displaySize);
    const detections = await faceapi
      .detectAllFaces(imageFile)
      .withFaceLandmarks()
      .withFaceDescriptors();

    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    resizedDetections.forEach(detection => {
      const box = detection.detection.box;
      const drawBox = new faceapi.draw.DrawBox(box, {
        label: "Face"
      });
      drawBox.draw(canvas);
    });
  });
}

function loadLabeledImages() {
  const labels = [
    "Jean Grey",
    "Charles Xavier",
    "Cyclops",
    "Raven",
    "Magneto",
    "Vuk"
  ];
}
