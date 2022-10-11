<script>
export default {
  props: [],
  data() {
    return {};
  },
  methods: {},
};
</script>

<template>
  <div class="loader">
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
    >
      <circle
        cx="50"
        cy="50"
        r="0"
        fill="none"
        stroke="#337ab7"
        strokeWidth="2"
      >
        <animate
          attributeName="r"
          repeatCount="indefinite"
          dur="1.1363636363636365s"
          values="0;40"
          keyTimes="0;1"
          keySplines="0 0.2 0.8 1"
          calcMode="spline"
          begin="0s"
        ></animate>
        <animate
          attributeName="opacity"
          repeatCount="indefinite"
          dur="1.1363636363636365s"
          values="1;0"
          keyTimes="0;1"
          keySplines="0.2 0 0.8 1"
          calcMode="spline"
          begin="0s"
        ></animate>
      </circle>
      <circle
        cx="50"
        cy="50"
        r="0"
        fill="none"
        stroke="#5bc0de"
        strokeWidth="2"
      >
        <animate
          attributeName="r"
          repeatCount="indefinite"
          dur="1.1363636363636365s"
          values="0;40"
          keyTimes="0;1"
          keySplines="0 0.2 0.8 1"
          calcMode="spline"
          begin="-0.5681818181818182s"
        ></animate>
        <animate
          attributeName="opacity"
          repeatCount="indefinite"
          dur="1.1363636363636365s"
          values="1;0"
          keyTimes="0;1"
          keySplines="0.2 0 0.8 1"
          calcMode="spline"
          begin="-0.5681818181818182s"
        ></animate>
      </circle>
    </svg>
  </div>
</template>

<style>
.loader {
  display: none;
  width: 100%;
  position: fixed;
  left: 0px;
  top: 0px;
  right: 0px;
  bottom: 0px;
  justify-content: center;
  align-items: center;
  background: white;
  z-index: 9000;
}

.loader.active {
  display: flex;
}

.loader svg {
  margin: "auto";
  background: "rgb(255, 255, 255)";
  display: "block";
  width: 200px;
  height: 200px;
}
</style>
