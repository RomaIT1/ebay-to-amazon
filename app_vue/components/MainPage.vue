<script>
export default {
  props: ["recording_status"],
  data() {
    return {
      username: "",
      password: "",
      errors: [],
      loading: false,
    };
  },
  methods: {
    submit: function () {},
    handle_toggle_click: function () {
      this.$emit("toggle_click");
    },
  },
};
</script>

<template>
  <div class="main-page">
    <img
      v-bind:class="{ active: recording_status === 'recording' }"
      class="bg-image"
      src="/img/bg_green.png"
    />
    <img
      v-bind:class="{ active: recording_status === 'not_recording' }"
      class="bg-image"
      src="/img/bg_red.png"
    />
    <div
      class="round-toggle"
      v-on:click="handle_toggle_click"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="72"
        height="72"
        viewBox="0 0 24 24"
        data-v-fbf4edba=""
        class="power-button-icon"
        style=""
        focusable="false"
        role="presentation"
        tabindex="-1"
      >
        <path
          fill="#001D2F"
          fill-rule="evenodd"
          d="M18.4577079,8.22289188 C20.7816334,11.3977569 20.4648,15.8333038 17.6619798,18.6469938 C14.5367581,21.7843354 9.46847908,21.7843354 6.34325742,18.6469938 C3.54287063,15.8357467 3.22392745,11.4050937 5.54200658,8.23044605 C5.86769376,7.78441208 6.49329736,7.68685173 6.93933133,8.01253891 C7.38536531,8.33822609 7.48292566,8.9638297 7.15723847,9.40986367 C5.41725615,11.7927982 5.65707121,15.1242295 7.76020527,17.2355198 C10.103757,19.5881601 13.9014802,19.5881601 16.2450319,17.2355198 C18.3499933,15.122395 18.5882217,11.787288 16.843854,9.40419442 C16.5176463,8.95854098 16.6144763,8.33282391 17.0601297,8.00661622 C17.5057831,7.68040853 18.1315002,7.77723844 18.4577079,8.22289188 Z M11.9996727,3 C12.5125085,2.99983219 12.9353061,3.38573401 12.993234,3.88305376 L13,3.99967268 L13.0026186,11.9996727 C13.0027993,12.5519574 12.5552306,12.9998192 12.0029459,13 C11.4901101,13.0001678 11.0673124,12.614266 11.0093845,12.1169462 L11.0026186,12.0003273 L11,4.00032732 C10.9998193,3.4480426 11.447388,3.00018083 11.9996727,3 Z"
        ></path>
      </svg>
    </div>
    <div
      v-if="recording_status === 'recording'"
      class="main-page-message save__success bg-green-lightest border-l-4 border-green-light mb-4 p-4 pt-3 text-sm"
    >
      <h3>Speechy is recording</h3>
      <p class="mt-1">Speechy will record your speech and analyze it later. Click on this message to turn OFF recording.</p>
    </div>
    <div
      v-if="recording_status === 'not_recording'"
      class="main-page-message login__error bg-red-lightest border-l-4 border-red-light p-4 pt-3 text-sm"
    >
      <h3>Speechy is NOT recording</h3>
      <p class="mt-1">Speechy will NOT record your speech. Click on the button above to turn ON recording.</p>
    </div>
  </div>
</template>

<style>
.main-page {
  user-select: none;
}
.bg-image {
  display: none;
  position: relative;
  top: -90px;
}

.bg-image.active {
  display: block;
}

.main-page-message {
  margin: 0px 24px;
}

.round-toggle {
  position: absolute;
  left: 50%;
  top: 140px;
  width: 110px;
  height: 110px;

  display: flex;
  justify-content: center;
  align-items: center;
  transform: translate(-50%, -50%);

  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;
  background-color: white;
  border-radius: 100%;
}

.round-toggle:hover {
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
}

.round-toggle svg {
  width: 70px;
  height: 70px;
  outline: none;
}
</style>
