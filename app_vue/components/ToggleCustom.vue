<script>
export default {
  props: ["text", "value", "reverse"],
  data() {
    return {};
  },
  methods: {
    handle_click(data, exec) {
      this.$emit("toggle");
    },
  },
};
</script>

<template>
  <div class="custom-toggle" :class="{ active: value, reverse: reverse }" @click="this.handle_click">
    <div class="custom-toggle__text" v-text="text"></div>
    <div class="custom-toggle-bar">
      <div class="custom-toggle-knob"></div>
    </div>
  </div>
</template>

<style scoped>
.custom-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  width: 100%;
  user-select: none;
  cursor: pointer;
  padding: 12px 24px;
}
.custom-toggle:hover {
  background: #dadce0;
}

.custom-toggle__text {
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.2px;
  color: rgba(0, 0, 0, 0.8);
}

.custom-toggle-bar {
  position: relative;
  height: 15px;
  width: 34px;
  border-radius: 80px;
  background-color: #bdc1c6;
  transition: all 80ms linear;
}

.custom-toggle-knob {
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  left: -4px;
  height: 19px;
  width: 19px;
  border-radius: 50%;
  background-color: white;
  transition: all 80ms linear;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.4);
}
.custom-toggle-knob:active {
  box-shadow: 0px 0px 2px 7px rgb(223 222 222 / 30%);
}
.custom-toggle.active .custom-toggle-bar {
  background-color: rgb(26, 115, 232, 0.5);
}

.custom-toggle.active .custom-toggle-knob {
  left: calc(34px - 14px);
  background: #1a73e8;
  opacity: 1 !important;
}
.custom-toggle.active .custom-toggle-knob:active {
  box-shadow: 0px 0px 2px 7px rgb(26, 115, 232, 0.3);
}
.custom-toggle.reverse {
  flex-direction: row-reverse;
}
</style>
