import { _isUndefined, _listEmpty, _objectEmpty } from "./Utils";

export default class Detector {
	$video = null;

	constructor(options = {}) {
		this.init();
	}

	sceneChangeListener() {}
	medianFoundListener() {}

	//* Init Detector plugin
	init() {
		//* Get YouTube video html element
		this.$video = document.querySelector("video");

		//* Prev volume value (default - 0)
		let prevVolumeValue = 0;

		//* Audio API
		const audioCtx = new AudioContext();
		const src = audioCtx.createMediaElementSource(this.$video);
		const analyser = audioCtx.createAnalyser();

		analyser.connect(audioCtx.destination);
		src.connect(analyser);

		analyser.smoothingTimeConstant = 0;

		analyser.fftSize = 256;

		const bufferLength = analyser.frequencyBinCount;

		const dataArray = new Uint8Array(bufferLength);

		analyser.getByteTimeDomainData(dataArray);

		//* Add listener
		this.$video.addEventListener("loadedmetadata", this.initSCD.bind(this));

		//* Pick frames
		this.$video.addEventListener("scenechange", (event) => {
			this.sceneChangeListener();
		});
		//* Set frames video
		this.$video.addEventListener("medianFound", (event) => {
			analyser.getByteFrequencyData(dataArray);

			let currentVolumeValue = 0;

			dataArray.forEach((db_value) => {
				currentVolumeValue += db_value;
			});

			currentVolumeValue = currentVolumeValue / 255 / bufferLength;

			const currentFrameValue = event.detail.diff;

			if (currentVolumeValue > prevVolumeValue) {
				var volume_diff = currentVolumeValue - prevVolumeValue;
			} else {
				var volume_diff = 0;
			}

			prevVolumeValue = currentVolumeValue;

			this.medianFoundListener(currentFrameValue, volume_diff);
		});
	}

	//* Init SCD lib
	initSCD() {
		let d = Scd(this.$video, {
			mode: "PlaybackMode",
		});

		d.init();
		d.start();
	}
}
