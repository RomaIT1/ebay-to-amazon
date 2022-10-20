import Util from "chromane/js/Util.js";

async function getAllTabs() {
	return await chrome.tabs.query({ url: "https://www.youtube.com/*" });
}

async function popup() {
	let util = new Util();

	util.create_window_api({
		async defineConfig(data) {
			console.log(data);
			chrome.storage.local.set({
				secondInterval: data.secondInterval,
				sceneCount: data.sceneCount,
				soundMessage: data.soundMessage,
			});
		},
		getConfig() {
			return new Promise(async (resolve, reject) => {
				const secondInterval = await chrome.storage.local.get(
					"secondInterval"
				);
				const sceneCount = await chrome.storage.local.get("sceneCount");

				const soundMessage = await chrome.storage.local.get("soundMessage");

				const data = {
					secondInterval: Object.keys(secondInterval).length
						? secondInterval.secondInterval
						: 4,
					sceneCount: Object.keys(sceneCount).length
						? sceneCount.sceneCount
						: 5,
					soundMessage: Object.keys(soundMessage).length
						? soundMessage.soundMessage
						: false,
				};

				console.log();

				resolve(data);
			});
		},
	});

	// inject iframe
	let config = await fetch("/config.json");
	config = await config.json();

	let manifest = chrome.runtime.getManifest();
	let iframe = document.createElement("iframe");

	iframe.name = JSON.stringify({
		context: "iframe",
		config,
		manifest,
	});

	iframe.src = config.popup_urls[config.mode];
	document.body.append(iframe);
}

popup();
