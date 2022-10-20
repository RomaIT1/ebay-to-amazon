import { _isUndefined, _listEmpty, _objectEmpty } from "./Utils";

export default class Graph {
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
	constructor(options) {
		this.detector = options.detector;
		this.init();
	}

	init() {
		this.window = this.createWindow();
		this.visibleIcon = document.querySelector("#visible-icon");
		this.canvasInit();

		this.detector.medianFoundListener = this.medianChange.bind(this);
		this.visibleIcon.addEventListener("click", this.visibleGraph.bind(this));
	}

	visibleGraph() {
		this.window.classList.toggle("active");
	}

	medianChange(currentFrameValue, volume_diff) {
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
	}

	createWindow() {
		const $message = document.createElement("div");

		$message.classList.add("detector-graph");
		$message.insertAdjacentHTML(
			"beforeend",
			/*html*/ `
			<button class="detector-graph__visible-icon" id="visible-icon"></button>
			<canvas class="detector-graph__canvas" id="graph-canvas"></canvas>
        `
		);

		document.body.appendChild($message);

		return $message;
	}

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

	drawChart() {
		this.graphCanvasProp.context.clearRect(
			0,
			0,
			this.graphCanvasProp.width,
			this.graphCanvasProp.height
		);

		this.renderLine(
			this.graphCanvasProp.context,
			this.framesGraphProp.point,
			{
				color: "#c62828",
			}
		);
		this.renderLine(
			this.graphCanvasProp.context,
			this.volumeGraphProp.point,
			{
				color: "#1a237e",
			}
		);
	}

	renderLine(ctx, data, options = {}) {
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
}
