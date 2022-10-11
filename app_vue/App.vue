<script>
import Drawer from "../node_modules/chromane/components/Drawer.vue";
import Header from "../node_modules/chromane/components/Header.vue";

import SignInForm from "./components/SignInForm.vue";
import SignUpForm from "./components/SignUpForm.vue";
import NotificationOverlay from "./components/NotificationOverlay.vue";
import MainPage from "./components/MainPage.vue";
import ProgressOverlay from "./components/ProgressOverlay.vue";

import Util from "chromane/js/Util.js";

import set from "./set.js";

export default {
  components: {
    Header,
    Drawer,
    SignInForm,
    SignUpForm,
    MainPage,
    NotificationOverlay,
    ProgressOverlay,
  },
  data() {
    return {
      title: "Speechy",
      plans: [],
      settings: {},
      drawer_items: [],
      active_page_name: "sign_in_form",
      //
      access_token: null,
      last_generate_report_request_ts: 0,
      //
      auth_status: "unknown",
      //
      recording_status: "recording",
      //
      mode: "notification",
      //
      app_status: "progress",
      // updaters
      updaters: [
        [
          // drawer_items
          ["access_token", "last_generate_report_request_ts"],
          function () {
            if (this.access_token) {
              let drawer_items = [];
              drawer_items.push({
                name: "home",
                title: "Home Page",
                icon_name: "home",
                visible: true,
              });
              if (Date.now() - this.last_generate_report_request_ts > 5000) {
                drawer_items.push({
                  name: "generate_report",
                  title: "Generate Report",
                  icon_name: "monitor-dashboard",
                  visible: true,
                });
              }
              drawer_items.push({
                name: "log_out",
                title: "Log Out",
                icon_name: "logout-variant",
                visible: true,
              });
              this.drawer_items = drawer_items;
            } else {
              this.drawer_items = [
                {
                  name: "home",
                  title: "Home Page",
                  icon_name: "home",
                  visible: true,
                },
              ];
            }
          },
        ],
        [
          // auth_status
          ["access_token"],
          function () {
            if (this.access_token) {
              this.auth_status = "logged_in";
            } else {
              this.auth_status = "not_logged_in";
            }
            this.$refs.notification_overlay.set("auth_status", this.auth_status);
          },
        ],
        [
          // recording_status
          ["recording_status"],
          function () {
            this.$refs.notification_overlay.set("recording_status", this.recording_status);
          },
        ],
      ],
    };
  },
  async mounted() {
    this.app_status = "progress";
    window.util = new Util();
    window.parent_wrap = window.util.create_window_wrap(window, window.parent);
    let init_data = JSON.parse(window.name);
    window.config = init_data.config;
    if (init_data.context === "iframe") {
      this.mode = "popup";
    } else {
      this.mode = "notification";
    }
    window.util.create_window_api({
      visualize: (data_array) => {
        this.visualize(data_array);
      },
      start_hiding_animation: () => {
        this.$refs.notification_overlay.start_hiding_animation();
      },
    });
    console.log("iframe_ready");
    window.parent_wrap.exec("iframe_ready");

    let storage = await window.parent_wrap.exec("storage_get", null);

    this.set("access_token", storage.access_token);
    this.set("last_generate_report_request_ts", storage.last_generate_report_request_ts || 0);

    if (storage.recording_status === "recording") {
      this.set("recording_status", storage.recording_status);
    } else {
      this.set("recording_status", "not_recording");
    }

    if (storage.access_token) {
      this.active_page_name = "main_page";
    } else {
      this.active_page_name = "sign_in_form";
    }

    this.app_status = "idle";
  },
  methods: {
    // set
    set: set,
    // methods
    visualize: function (data_array) {
      var canvas_arr = Array.from(document.querySelectorAll(".audio_visual"));
      var ctx_arr = canvas_arr.map((canvas) => {
        return canvas.getContext("2d");
      });

      if (canvas_arr.length === 0) {
        return;
      }

      if (this.recording_status === "recording") {
        var m = 1;
      } else {
        var m = 1;
      }

      var WIDTH = canvas_arr[0].width;
      var HEIGHT = canvas_arr[0].height;
      let x = 0;

      var barWidth = (WIDTH / data_array.length) * 2.5;

      ctx_arr.forEach((ctx) => {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
      });

      for (var i = 0; i < data_array.length; i++) {
        let barHeight = (data_array[i] / 2) * m;

        var r = 255 - (255 - 112) * (80 / 80);
        var g = 255 - (255 - 188) * (80 / 80);
        var b = 255 - (255 - 225) * (80 / 80);

        ctx_arr.forEach((ctx) => {
          ctx.fillStyle = `rgba( ${r}, ${g}, ${b}, 0.6 )`;
          ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
        });

        x += barWidth + 1;
      }

      // var barWidth = (WIDTH / data_array.length) * 2.5;
      // console.log("canvas_arr", canvas_arr);
      // ctx_arr.forEach((ctx) => {
      //   ctx.fillStyle = "#000";
      //   ctx.fillRect(0, 0, WIDTH, HEIGHT);
      // });

      // ctx_arr.forEach((ctx) => {
      //   ctx.fillStyle = `rgb( ${r}, ${g}, ${b} )`;
      //   ctx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight);
      // });

      // x += barWidth + 1;
    },
    // handlers
    handle_menu_button_click: function () {
      this.$refs.drawer.open();
    },
    handle_close_button_click: function () {
      window.parent_wrap.exec("close");
      window.parent_wrap.exec("close_iframe");
    },
    handle_notification_overlay_click() {
      window.parent_wrap.exec("toggle_iframe_mode", ["notification", "notification_extra"]);
      console.log("click");
    },
    handle_toggle_click: async function () {
      console.log("click");
      if (this.recording_status === "recording") {
        this.set("recording_status", "not_recording");
      } else {
        this.set("recording_status", "recording");
      }
      await window.parent_wrap.exec("storage_set", { recording_status: this.recording_status });
      await window.parent_wrap.exec("reload");
    },
    handle_sign_in_request: async function (data) {
      this.app_status = "progress";
      let response = await window.util.fetch_json(window.config.backend_url + "/api/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      console.log(response);
      if (response.error) {
        this.$refs.sing_in_form.errors = [response.error.message];
      } else {
        this.$refs.sing_in_form.errors = [];
        this.active_page_name = "main_page";
      }
      if (response && response.data && response.data.accessToken) {
        await window.parent_wrap.exec("storage_set", { access_token: response.data.accessToken });
      }
      if (response && response.data && response.data.refreshToken) {
        await window.parent_wrap.exec("storage_set", { refresh_token: response.data.refreshToken });
      }
      if (response && response.data && response.data.accessToken) {
        window.parent_wrap.exec("reload");
      }
      this.app_status = "idle";
      this.set("access_token", response.data.accessToken);
    },
    handle_sign_up_request: async function (data) {
      this.app_status = "progress";
      let response = await window.util.fetch_json(window.config.backend_url + "/api/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      console.log(response);
      if (response && response.data && response.data.accessToken) {
        await window.parent_wrap.exec("storage_set", { access_token: response.data.accessToken });
      }
      if (response.error) {
        this.$refs.sing_up_form.errors = [response.error.message];
      } else {
        this.$refs.sing_in_form.errors = [];
        this.active_page_name = "main_page";
      }
      if (response && response.data && response.data.accessToken) {
        await window.parent_wrap.exec("storage_set", { access_token: response.data.accessToken });
      }
      if (response && response.data && response.data.refreshToken) {
        await window.parent_wrap.exec("storage_set", { refresh_token: response.data.refreshToken });
      }
      if (response && response.data && response.data.accessToken) {
        window.parent_wrap.exec("reload");
      }
      this.app_status = "idle";
      this.set("access_token", response.data.accessToken);
    },
    handle_go_to_sign_in_request: function () {
      this.active_page_name = "sign_in_form";
    },
    handle_go_to_sign_up_request: function () {
      this.active_page_name = "sign_up_form";
    },
    handle_drawer_item_click: async function (data) {
      console.log("drawer_item_click", data);
      if (data.name === "home") {
        window.parent_wrap.exec("open_home");
      } else if (data.name === "generate_report") {
        await window.util.fetch_json(window.config.backend_url + "/api/generate-report", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });
        await window.parent_wrap.exec("storage_set", { last_generate_report_request_ts: Date.now() });
        let ts = Date.now();
        this.set("last_generate_report_request_ts", ts);
        alert("Request to generate report sent!");
        await window.util.wait(5000 + 10);
        // set this value again to trigger an updater
        this.set("last_generate_report_request_ts", ts);
      } else if (data.name === "log_out") {
        this.set("access_token", null);
        window.parent_wrap.exec("reload");
        await window.parent_wrap.exec("storage_set", { access_token: null, refresh_token: null });
        this.active_page_name = "sign_in_form";
      }
    },
  },
};
</script>
<template>
  <div class="app">
    <Header
      v-bind:title="title"
      v-on:menu_button_click="handle_menu_button_click"
      v-on:close_button_click="handle_close_button_click"
    ></Header>
    <Drawer
      :title="title"
      :items="drawer_items"
      v-on:drawer_item_click="handle_drawer_item_click"
      v-on:drawer_overlay_click="drawer_overlay_click"
      ref="drawer"
    ></Drawer>
    <div
      class="page"
      v-if="active_page_name === 'sign_up_form'"
    >
      <SignUpForm
        ref="sing_up_form"
        v-on:go_to_sign_in_request="handle_go_to_sign_in_request"
        v-on:sign_up_request="handle_sign_up_request"
      ></SignUpForm>
    </div>
    <div
      class="page"
      v-if="active_page_name === 'sign_in_form'"
    >
      <SignInForm
        ref="sing_in_form"
        v-on:go_to_sign_up_request="handle_go_to_sign_up_request"
        v-on:sign_in_request="handle_sign_in_request"
      ></SignInForm>
    </div>
    <div
      class="page"
      v-if="active_page_name === 'main_page'"
    >
      <MainPage
        v-bind:recording_status="recording_status"
        v-on:toggle_click="handle_toggle_click"
      ></MainPage>
    </div>
    <NotificationOverlay
      v-bind:class="{ active: mode === 'notification' }"
      v-on:notification_click="handle_notification_overlay_click"
      v-on:toggle_click="handle_toggle_click"
      ref="notification_overlay"
    ></NotificationOverlay>
    <ProgressOverlay v-bind:class="{ active: app_status === 'progress' }"></ProgressOverlay>
  </div>
</template>

<style>
html,
body,
#root,
.app {
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px;
  background-color: white;
}
.app {
  display: flex;
  flex-direction: column;
}
* {
  box-sizing: border-box;
}

#header {
  z-index: 900;
}
.page {
  flex-grow: 1;
  position: relative;
  width: 100%;
  height: 100%;
  max-height: calc(100vh - 50px);
  overflow-y: auto;
  background: #f3f3f3;
}
.page__toggle {
  margin: 10px 0px 10px 0px;
}
.page__additional {
  max-height: 0px;
  overflow: hidden;
  transition: all 0.4s linear;
}
.page__additional.open {
  max-height: 100vh;
}
.main-title {
  font-size: 19px;
  letter-spacing: 0.4px;
  font-weight: 500;
  color: black;
}
.page .chromane-toggle {
  margin-bottom: 12px;
}
.message {
  margin-bottom: 12px;
  padding: 24px;
  border: 1px solid rgba(0, 0, 0, 12);
  border-radius: 4px;
  font-size: 16px;
}
.message-green {
  background-color: rgb(149, 250, 171);
}
.message-red {
  background-color: rgb(250, 149, 149);
}
.message-grey {
  background-color: rgb(216, 216, 216);
}
</style>
