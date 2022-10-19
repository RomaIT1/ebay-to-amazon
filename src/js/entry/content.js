function _isUndefined(value) {
	return typeof value === "undefined";
}

function renderModel(ctx, data, options = {}) {
	ctx.strokeStyle = options.color;
	ctx.lineWidth = 4;

	ctx.beginPath();

	var x = 0;

	for (let i = 0; i < data.length; i++) {
		let y = data[i];

		ctx.lineTo(x, y);

		x += 5;
	}

	ctx.stroke();
	ctx.closePath();
}

class Detector {
	$video = null;
	graphCanvasProp = {
		$el: null,
		context: null,
		width: null,
		height: null,
	};

	volumeGraphProp = {
		point: [],
	};
	framesGraphProp = {
		point: [],
	};

	sceneChangeListener = () => {};

	constructor(options = {}) {
		this.sceneChangeListener = _isUndefined(options.sceneChangeListener)
			? this.sceneChangeListener
			: options.sceneChangeListener;

		this.init();
	}

	//* Init Detector plugin
	init() {
		//* Create window message
		this.$message = this.createGraph();

		//* Get YouTube video html element
		this.$video = document.querySelector("video");

		// //* If video is not defined (finish programm)
		// if (!this.$video) return;

		//* Get detector canvas
		this.canvasInit();

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
		this.$video.addEventListener(
			"scenechange",
			this.sceneChangeListener.bind(this)
		);

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

			//* Pick volume
			if (
				Math.abs(currentVolumeValue - prevVolumeValue) >
				Math.round(30 * this.$video.volume)
			) {
				// this.visibleMessage();
			}

			// Add point chart
			this.framesGraphProp.point.push(
				this.graphCanvasProp.height - 3 - currentFrameValue
			);
			this.volumeGraphProp.point.push(
				this.graphCanvasProp.height -
					3 -
					volume_diff * this.graphCanvasProp.height
			);

			this.framesGraphProp.point = this.framesGraphProp.point.slice(-100);
			this.volumeGraphProp.point = this.volumeGraphProp.point.slice(-100);

			this.drawChart();
		});

		//* Listener send message from window
		chrome.runtime.onMessage.addListener(this.sendWindowMessage.bind(this));
	}

	sendWindowMessage(request, sender, sendResponse) {
		if (request.visible) {
			this.$message.classList.add("active");
		} else {
			this.$message.classList.remove("active");
		}
	}

	drawChart() {
		this.graphCanvasProp.context.clearRect(
			0,
			0,
			this.graphCanvasProp.width,
			this.graphCanvasProp.height
		);

		renderModel(this.graphCanvasProp.context, this.framesGraphProp.point, {
			color: "#c62828",
		});
		renderModel(this.graphCanvasProp.context, this.volumeGraphProp.point, {
			color: "#1a237e",
		});
	}

	//* Canvas init
	canvasInit() {
		this.graphCanvasProp.$el = document.querySelector("#graph-canvas");
		this.graphCanvasProp.context = this.graphCanvasProp.$el.getContext("2d");
		this.graphCanvasProp.width = 600;
		this.graphCanvasProp.height = 200;

		// Set size node canvas
		this.graphCanvasProp.$el.style.width =
			this.graphCanvasProp.width / 2 + "px";
		this.graphCanvasProp.$el.style.height =
			this.graphCanvasProp.height / 2 + "px";

		// Set size chart canvas
		this.graphCanvasProp.$el.width = this.graphCanvasProp.width;
		this.graphCanvasProp.$el.height = this.graphCanvasProp.height;
	}

	//* Init SCD lib
	initSCD() {
		let d = Scd(this.$video, {
			mode: "PlaybackMode",
		});

		d.init();
		d.start();
	}

	//* Create message node
	createGraph() {
		const $message = document.createElement("div");

		$message.classList.add("ext-message");
		$message.insertAdjacentHTML(
			"beforeend",
			/*html*/ `
            <div class="ext-message__graph graph">
                <div class="graph__label">Change graph</div>
                <canvas class="graph__canvas" id="graph-canvas"></canvas>
            </div>
				<div class="ext-message__info info">
						<ul class="info__list list">
							<li class="list__item">
								red: <span class="frames-color">frames</span>
							</li>
							<li class="list__item">
								blue: <span class="volume-color">volume</span>
							</li>
						</ul>
				</div>
        `
		);

		document.body.appendChild($message);

		return $message;
	}
}

function detector(config) {
	return new Detector(config);
}

// detector().init();

// //* Hidden message after time value
// hiddenMessage(time = 0) {
// 	this.timeOutMessage = setTimeout(() => {
// 		this.$message.classList.remove("active");
// 	}, time);
// }

// //* Open message (active add class)
// visibleMessage() {
// 	clearTimeout(this.timeOutMessage);
// 	this.$message.classList.add("active");
// 	this.hiddenMessage(1500);
// }

class Message {
	type = "danger";
	secondInterval = 4;
	sceneCount = 5;

	/**
	 * setInterval hidden mwssage
	 */
	_timeOutMessage = null;

	/**
	 * time change interval (1 sec)
	 */
	_timeInterval = null;

	/**
	 * Count time interval (max - "secondInterval")
	 */
	_timeIntervalValue = 0;

	/**
	 * Count change frames (max - "sceneCount")
	 */
	_countChangeScene = 0;

	/**
	 * Start check count change scene
	 */
	_checkTimeState = false;

	constructor(options = {}) {
		// console.log(_isUndefined(options.type));
		this.type = _isUndefined(options.type) ? this.type : options.type;
		this.secondInterval = _isUndefined(options.secondInterval)
			? this.secondInterval
			: options.secondInterval;
		this.sceneCount = _isUndefined(options.sceneCount)
			? this.sceneCount
			: options.sceneCount;
		this.detector = options.detector;

		this.init();
	}

	init() {
		if (!this.detector) return;

		document.addEventListener(
			"DOMContentLoaded",
			this.contentLoaded.bind(this)
		);
	}

	contentLoaded() {
		this.message = this.createMessage();

		this.createMessage();

		const detector = this.detector({
			sceneChangeListener: this.sceneChange.bind(this),
		});

		this._timeInterval = setInterval(
			this.checkSecondInterval.bind(this),
			1000
		);
	}

	sceneChange() {
		this._checkTimeState = true;

		if (this._countChangeScene === this.sceneCount) {
			this.showMessage(this.message);
			this._countChangeScene = 0;

			return;
		}

		this._countChangeScene++;
	}

	checkSecondInterval() {
		if (!this._checkTimeState) return;

		if (this._timeIntervalValue === this.secondInterval) {
			if (this._countChangeScene < this.sceneCount) {
				this._countChangeScene = 0;
			}

			this._timeIntervalValue = 0;
			this._checkTimeState = false;
			return;
		}

		this._timeIntervalValue++;
	}

	createMessage() {
		const message = document.createElement("div");

		message.classList.add("detector-message", this.type);
		message.insertAdjacentHTML(
			"beforeend",
			/*html*/ `
			<div class="detector-message__inner">
				<div class="detector-message__icon">
					<img src="${chrome.runtime.getURL(
						"/img/error-icon.webp"
					)}" alt="message danger icon">
				</div>
				<div class="detector-message__info">
					<h5 class="detector-message__title">Danger</h5>
					<p class="detector-message__text">Danger text</p>
				</div>
			</div>
			`
		);

		document.body.appendChild(message);

		return message;
	}

	showMessage(message) {
		clearTimeout(this._timeOutMessage);
		message.classList.add("active");
		this.hiddenMessage(message, 2000);
	}

	hiddenMessage(message, time = 0) {
		this._timeOutMessage = setTimeout(() => {
			message.classList.remove("active");
		}, time);
	}
}

function message(options) {
	return new Message(options);
}

message({
	detector: detector,
});
