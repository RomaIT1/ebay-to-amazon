import Detector from "./Detector";
import Message from "./Message";
import Graph from "./Graph";
import Extension from "./Extension";
import { _isUndefined, _listEmpty, _objectEmpty } from "./Utils";

function graph(options) {
	return new Graph(options);
}

function detector(options) {
	return new Detector(options);
}

function message(options) {
	return new Message(options);
}

function extension(options) {
	return new Extension(options);
}

export {
	graph,
	detector,
	message,
	extension,
	_isUndefined,
	_listEmpty,
	_objectEmpty,
};
