import Util from "chromane/js/Util.js";

async function getAllTabs() {
	return await chrome.tabs.query({ url: "https://www.youtube.com/*" });
}

async function popup() {
	let util = new Util();

	console.log(chrome.storage.local.get().then((data) => console.log(data)));
	util.create_window_api({
		async defineConfig(data) {
			chrome.storage.local.set({
				secondInterval: data.secondInterval,
				sceneCount: data.sceneCount,
			});

			// const tabs = await getAllTabs();

			// tabs.forEach((tab) => {
			// 	chrome.tabs.sendMessage(tab.id, data);
			// });
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
