<script>
import ToggleCustom from "./ToggleCustom.vue";

import set from "../set.js";

export default {
  components: {
    ToggleCustom,
  },
  data() {
    return {
      username: "",
      password: "",
      errors: [],
      loading: false,
      // status
      recording_status: "unknown",
      auth_status: "unknown",
      status: "unknown",
      // updaters
      updaters: [
        [
          // status
          ["recording_status", "auth_status"],
          function () {
            if (this.auth_status === "logged_in") {
              if (this.recording_status === "recording") {
                this.status = "recording";
              } else {
                this.status = "not_recording";
              }
            } else {
              this.status = "not_logged_in";
            }
          },
        ],
      ],
    };
  },
  methods: {
    // set
    set: set,
    // methods
    start_hiding_animation: function () {
      if (this.$refs.progress_inner) {
        this.$refs.progress_inner.style.width = "0%";
      }
    },
    // handlers
    handle_notification_overlay_click: function () {
      if (this.status !== "not_logged_in") {
        this.$emit("notification_click");
      }
    },
    handle_toggle_click: function (event) {
      event.stopPropagation();
      this.$emit("toggle_click");
    },
  },
};
</script>

<template>
  <div
    class="notification_overlay"
    v-bind:class="{ recording: status === 'recording' }"
    v-on:click="handle_notification_overlay_click()"
  >
    <div class="notification_overlay-main">
      <img src="/img/logo_rect.png" />
      <canvas class="audio_visual"></canvas>
      <div
        class="notification_overlay-details"
        v-if="status === 'recording'"
      >
        <div class="notification_overlay-header">Speechy is recording</div>
        <p class="notification_overlay-text">Speechy will record your speech on this tab and analyze it later. Click on this message to turn OFF recording.</p>
      </div>
      <div
        class="notification_overlay-details"
        v-if="status === 'not_recording'"
      >
        <div class="notification_overlay-header">Speechy is NOT recording</div>
        <p class="notification_overlay-text">Speechy will NOT record your speech on this tab. Click on this message to turn ON recording.</p>
      </div>
      <div
        class="notification_overlay-details"
        v-if="status === 'not_logged_in'"
      >
        <div class="notification_overlay-header">Speechy is NOT recording</div>
        <p class="notification_overlay-text">Speechy will NOT record your speech on this tab. Please log in first by clicking the extension icon.</p>
      </div>
    </div>
    <div class="notification_overlay-toggle">
      <ToggleCustom
        :text="'Enable'"
        :value="recording_status === 'recording'"
        v-on:click="handle_toggle_click"
      />
    </div>
    <div class="notification_overlay-progress">
      <div
        ref="progress_inner"
        class="notification_overlay-progress-inner"
      ></div>
    </div>
  </div>
</template>

<style>
.notification_overlay {
  display: none;
  position: absolute;
  overflow: hidden;
  z-index: 9000;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  padding: 0px;

  background-color: white;
  cursor: pointer;
  filter: grayscale(1);
  transition: all 0.2s ease;

  user-select: none;
}
.notification_overlay.active {
  display: block;
}
.notification_overlay.recording {
  filter: grayscale(0);
}
.notification_overlay-progress {
  position: absolute;
  z-index: 99000;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 3px;
  padding: 0px;

  background: #dcdcdc;
}
.notification_overlay-progress-inner {
  height: 100%;
  width: 100%;
  background: #0052a6;
  transition: all 4s linear;
}

.notification_overlay-main {
  position: absolute;
  z-index: 9000;
  top: 3px;
  left: 0px;
  width: 100%;
  height: 100%;
  padding: 0px;

  display: flex;
  flex-direction: row;

  width: 100%;
  height: 64px;
}
.notification_overlay-toggle {
  position: absolute;
  top: calc(3px + 64px);
  width: 100%;
  height: 48px;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}
.notification_overlay-details {
  position: relative;
  z-index: 900;
}
.notification_overlay img {
  height: 64px;
  margin-right: 12px;
}
.notification_overlay canvas {
  position: absolute;
  z-index: 700;
  left: 64px;
  top: 0px;
  width: calc(100% - 64px);
  height: 100%;
}
.notification_overlay-header {
  font-size: 16px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.9);
  margin: 5px 0px 2px 0px;
}
.notification_overlay-text {
  margin: 0px;
  padding-right: 12px;
  font-size: 13px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.7);
}
</style>
