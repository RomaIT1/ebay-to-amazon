<script>
export default {
  props: ["custom_value", "is_open", "name", "label"],
  methods: {},
};
</script>

<template>
  <div class="textarea-custom">
    <textarea v-model="custom_value" :placeholder="label" @input="$emit('input', $event)" :name="this.name" :class="is_open ? 'active' : ''"></textarea>
  </div>
</template>

<style scoped>
.textarea-custom {
  padding: 12px 20px 0px 24px;
  position: relative;
}
textarea {
  outline: none !important;
  font-size: 14px;
  padding: 0px;
  width: 100%;
  height: 0px;
  resize: none;
  overflow: hidden;
  visibility: hidden;
  opacity: 0;
  min-height: 0px;
  border-radius: 5px;
  transition: all 0.4s ease;
  border: 1px solid rgb(130 130 130);
  display: block;
  height: 0px;
}
textarea:hover {
  border: 1px solid rgb(26, 32, 39);
}
textarea:focus {
  border: 1px solid #1967d2;
}
textarea.active {
  position: relative;
  min-height: 100px;
  visibility: visible;
  opacity: 1;
  padding: 10px 12px;
}
textarea::placeholder {
  color: rgb(130 130 130);
  letter-spacing: normal;
}
</style>
