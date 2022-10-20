import { _isUndefined, _listEmpty, _objectEmpty } from "./Utils";

export default class Extension {
	constructor(options) {
		this.message = options.message;
		this.init();
	}

	init() {
		chrome.storage.local.onChanged.addListener(this.changeStorage.bind(this));
	}

	changeStorage(changes) {
		this.updateMessageConfig(this.message, changes);
	}

	updateMessageConfig(message, changes) {
		const keys = Object.keys(changes);

		keys.forEach((key) => {
			message[key] = changes[key].newValue;
		});
	}
}
