import { graph, message, detector, extension, _objectEmpty } from "./module";
import {
	SECOND_INTERVAL_DEFAULT,
	SCENE_COUNT_DEFAULT,
	SOUND_MESSAGE_DEFAULT,
} from "./module/config";

document.addEventListener("DOMContentLoaded", main);

async function main() {
	const secondInterval = await chrome.storage.local.get("secondInterval");
	const sceneCount = await chrome.storage.local.get("sceneCount");
	const soundMessage = await chrome.storage.local.get("soundMessage");

	/**
	 * Init detector
	 */
	const videoDetector = detector();

	/**
	 * Init message
	 */
	const mess = message({
		detector: videoDetector,
		secondInterval: _objectEmpty(secondInterval)
			? SECOND_INTERVAL_DEFAULT
			: secondInterval.secondInterval,
		sceneCount: _objectEmpty(sceneCount)
			? SCENE_COUNT_DEFAULT
			: sceneCount.sceneCount,
		soundMessage: _objectEmpty(soundMessage)
			? SOUND_MESSAGE_DEFAULT
			: soundMessage.soundMessage,
	});

	/**
	 * Init extension
	 */
	extension({
		message: mess,
	});

	/**
	 * Init graph
	 */
	graph({
		detector: videoDetector,
	});
}
