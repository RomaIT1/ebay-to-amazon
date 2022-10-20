import { _isUndefined, _listEmpty, _objectEmpty } from "./Utils";

export default class Message {
	/**
	 * Optional
	 */
	type = "danger";

	/**
	 * setInterval hidden message
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
		this.type = _isUndefined(options.type) ? this.type : options.type;
		this.secondInterval = options.secondInterval;
		this.sceneCount = options.sceneCount;
		this.detector = options.detector;
		this.soundMessage = options.soundMessage;

		this.init();
	}

	init() {
		if (!this.detector) return;

		this.message = this.createMessage();
		this.audio = this.message.querySelector("audio");

		this.detector.sceneChangeListener = this.sceneChange.bind(this);

		this._timeInterval = setInterval(
			this.checkSecondInterval.bind(this),
			1000
		);
	}

	sceneChange() {
		this._checkTimeState = true;

		if (this._countChangeScene === this.sceneCount) {
			if (this.soundMessage) {
				this.soundPlay(this.audio);
			}

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
				<audio src="${chrome.runtime.getURL("/media/notify.mp3")}"></audio>
			</div>
			`
		);

		document.body.appendChild(message);

		return message;
	}

	soundPlay(audio) {
		audio.pause();
		audio.play();
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
