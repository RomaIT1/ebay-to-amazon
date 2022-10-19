import Util from "chromane/js/Util.js";

async function popup() {
	let util = new Util();

	util.create_window_api({});

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
