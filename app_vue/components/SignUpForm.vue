<script>
export default {
  props: ["text", "value", "reverse"],
  data() {
    return {
      name: "",
      email: "",
      password_1: "",
      password_2: "",
      errors: [],
      loading: false,
    };
  },
  methods: {
    submit: async function (event) {
      event.preventDefault();
      console.log(event);
      this.$emit("sign_up_request", {
        name: this.name,
        email: this.email,
        password: this.password_1,
      });
    },
    handle_sign_in_click: function () {
      this.$emit("go_to_sign_in_request");
    },
  },
};
</script>

<template>
  <form
    method="post"
    action="#"
    v-on:submit="submit"
    class="login"
  >
    <h2 class="login__title">Sign Up</h2>
    <div
      v-if="errors.length"
      class="login__error bg-red-lightest border-l-4 border-red-light p-4 pt-3 text-sm"
    >
      <p
        v-for="err in errors"
        class="mt-1"
        v-bind:key="{ err }"
        v-text="err"
      ></p>
    </div>
    <input
      required
      type="text"
      class="appearance-none border border-grey focus:shadow-outline focus:outline-none leading-tight mt-2 px-3 py-2 rounded text-grey-darker w-full"
      v-model="name"
      :disabled="loading"
      placeholder="Name"
    />
    <input
      required
      type="text"
      class="appearance-none border border-grey focus:shadow-outline focus:outline-none leading-tight mt-2 px-3 py-2 rounded text-grey-darker w-full"
      v-model="email"
      :disabled="loading"
      placeholder="Email"
    />
    <input
      required
      type="password"
      class="appearance-none border border-grey focus:shadow-outline focus:outline-none leading-tight px-3 py-2 rounded text-grey-darker w-full"
      v-model="password_1"
      :disabled="loading"
      placeholder="Password"
    />
    <input
      required
      type="password"
      class="appearance-none border border-grey focus:shadow-outline focus:outline-none leading-tight px-3 py-2 rounded text-grey-darker w-full"
      v-model="password_2"
      :disabled="loading"
      placeholder="Confirm Password"
    />
    <div class="login__redirect">
      or
      <span v-on:click="handle_sign_in_click">Sign In</span>
    </div>
    <input
      type="submit"
      value="Sign Up"
      class="login__button cursor-pointer bg-blue focus:outline-none focus:shadow-outline hover:bg-blue-dark px-4 py-2 rounded text-white"
    />
  </form>
</template>

<style></style>
