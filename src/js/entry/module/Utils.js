export function _isUndefined(value) {
	return typeof value === "undefined";
}

export function _listEmpty(list) {
	return list.length === 0;
}

export function _objectEmpty(object) {
	return Object.keys(object).length === 0;
}
