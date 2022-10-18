// this is a simple module which contains one function -
// that is a wrapper, which handles errors and helps make code more functional
// main controller, containts functions which override the native getUserMedia function

import Iframe from "./Iframe";

export default class Controller {
  constructor() {
    this.state = {
      // stream_data

      stream_data: {},

      // canvas_stream_is_active

      // object containing modules

      // window object

      window: window,

      // reverence to the native window.navigator.mediaDevices.getUserMedia method
      // we need to store this to call this method in the overriden function

      real_getUserMedia: window.navigator.mediaDevices.getUserMedia,
    };
  }
  init() {
    this.override();
    this.add_observers();
  }

  async add_observers() {
    this.extension_id = document.documentElement.dataset.meets_helper_extension_id;
    window.config = await window.util.fetch_json(`chrome-extension://${this.extension_id}/config.json`);
    this.iframe = new Iframe(this);
    this.window_wrap = window.util.create_window_wrap(window, window);
    console.log("this.window_wrap", this.window_wrap);
    await this.iframe.inject();

    window.util.create_window_api({
      set_iframe_mode: (mode) => {
        console.log("set_iframe_mode", mode);
        this.iframe.set_mode(mode);
      },
      toggle_iframe_mode: ([mode_1, mode_2]) => {
        console.log("toggle_iframe_mode", mode_1, mode_2);
        this.iframe.toggle_mode(mode_1, mode_2);
      },
      close_iframe: () => {
        this.iframe.close();
      },
    });
  }

  // override some native functions to capture the webcam stream
  override() {
    console.log("override");
    let _this = this;
    let app = { state: {} };

    let visualize_flag = false;
    let chunks = [];
    let chunk_index = 0;
    let index = 0;
    let recording_flag_was_shown = false;
    const blob_to_base64 = (blob) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      return new Promise((resolve) => {
        reader.onloadend = () => {
          resolve(reader.result);
        };
      });
    };

    function handle_data_availabe(e, stream, mediaRecorder) {
      console.log(mediaRecorder.audioBitsPerSecond);
      chunks.push(e.data);
      //
      const blob = new Blob(chunks, { type: "audio/webm; codecs=opus" });
      blob_to_base64(blob).then((base64) => {
        // console.log("base64", base64);
        _this.window_wrap.exec("save_chunk", [stream.id, chunk_index, base64]);
        //
      });
      //
      index += 1;
      if (index === 5) {
        // console.log("saving_chunks", chunks);
        // mediaRecorder.stop();
      } else if (index === 6) {
        // console.log("saving_chunks", chunks);
        // const audioURL = URL.createObjectURL(blob);
        // console.log(audioURL);
        // chunks = [];
        // index = 0;
        // chunk_index += 1;
        // start_recording(stream);
      } else {
        // console.log("saving_chunks", chunks);
      }
      console.log("saving_chunks", chunks);
    }
    async function start_recording(stream) {
      let storage = await _this.window_wrap.exec("storage_get", ["recording_status", "access_token"]);
      if (recording_flag_was_shown === false) {
        recording_flag_was_shown = true;
        visualize_flag = true;
        _this.iframe.open();
        _this.iframe.iframe_wrap.exec("start_hiding_animation");
        await window.util.wait(4200);
        _this.iframe.close();
        visualize_flag = false;
      }
      if (storage.recording_status !== "recording" || !storage.access_token) {
        return;
      }
      const mediaRecorder = new MediaRecorder(stream, {
        audioBitsPerSecond: 128000 / 2,
      });
      mediaRecorder.ondataavailable = (e) => {
        handle_data_availabe(e, stream, mediaRecorder);
      };
      mediaRecorder.start(1000);
    }
    window.navigator.mediaDevices.getUserMedia = async function (constraints) {
      // recording_flag_was_shown = false;
      console.log(document.documentElement.dataset.mm_context, constraints);

      var original_stream = await _this.state.real_getUserMedia.apply(this, arguments);

      console.log("getUserMedia:", constraints, original_stream, arguments);

      if (constraints.audio) {
        start_recording(original_stream);
        let renderFrame = () => {
          let bars = [];
          requestAnimationFrame(renderFrame);

          analyser.getByteFrequencyData(data_array);

          for (var i = 0; i < buffer_length; i++) {
            let bar = {};
            bar.height = data_array[i] / 2;

            var r = 12 * (bar.height / 80);
            var g = 192 * (bar.height / 80);
            var b = 225 * (bar.height / 80);

            bar.fillStyle = `rgb( ${r}, ${g}, ${b} )`;
            bars.push(bar);
            // x += barWidth + 1;
          }
          // console.log(_this.iframe);
          if (_this.iframe && _this.iframe.iframe_wrap) {
            if (visualize_flag) {
              _this.iframe.iframe_wrap.exec("visualize", data_array);
            }
          }
        };

        var audioCtx = new AudioContext();
        var analyser = audioCtx.createAnalyser();

        let src = audioCtx.createMediaStreamSource(original_stream);

        src.connect(analyser);
        analyser.fftSize = 256;

        let buffer_length = analyser.frequencyBinCount;
        var data_array = new Uint8Array(buffer_length);

        renderFrame();

        // return

        return original_stream;
        // // audio interception
        // _this.state.ac = new AudioContext();
        // _this.state.merger = _this.state.ac.createChannelMerger(2);
        // console.log("audio context", _this.state.ac);
        // _this.state.original_audio_stream = original_stream;
        // var node = _this.state.ac.createMediaStreamSource(original_stream);
        // node.connect(_this.state.merger, 0, 0);
        // var dest = _this.state.ac.createMediaStreamDestination();
        // _this.state.merger.connect(dest);
        // _this.state.audio_stream = dest.stream;
        // // rapid reply
        // app.state.audio_context = new AudioContext();
        // app.state.audio_source_node = app.state.audio_context.createMediaStreamSource(dest.stream);
        // await app.state.audio_context.audioWorklet.addModule(`chrome-extension://${document.documentElement.dataset.meets_helper_extension_id}/recorder_js/recorderWorkletProcessor.js`);
        // window.recorder_node = new AudioWorkletNode(app.state.audio_context, "recorder-worklet");
        // window.recorder_node.parameters.get("isRecording").setValueAtTime(1, app.state.audio_context.currentTime + 1);
        // console.log("app.state.audio_source_node", app.state.audio_source_node);
        // app.state.audio_source_node.connect(window.recorder_node);
        // app.state.mp3Data = [];
        // window.recorder_node.port.onmessage = (e) => {
        //   console.log("e", e);
        //   if (e.data.eventType === "data") {
        //     console.log("e", e);
        //     const audioData = e.data.audioBuffer;
        //     app.state.mp3Data = e.data.mp3Data;
        //     var blob = new Blob(app.state.mp3Data, { type: "audio/mp3" });
        //     let url = URL.createObjectURL(blob);
        //     document.querySelector("#chromane_audio").src = url;
        //     console.log("url", url);
        //     // this.vue_this.$refs.audio_recorder_page.set("audio_recording_blob", blob);
        //     // this.vue_this.$refs.audio_recorder_page.set("audio_recording_url", URL.createObjectURL(blob));
        //     // this.vue_this.$refs.audio_recorder_page.set("audio_recording_name", `Recorded with RapidReply - ${moment().format("DDMM HHmm")}.mp3`);
        //     // this.vue_this.$refs.audio_recorder_page.set("active_page_name", "audio_recording_ready");
        //     // this.handle_recording_complete();
        //   }
        // };
        // //
        // window.recorder_node.port.postMessage({ name: "start_recording" });
        // console.log("returning audio 333", dest.stream);
        // return dest.stream;
      } else {
        return original_stream;
      }
    };
  }
}
