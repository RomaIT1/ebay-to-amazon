<script>
export default {
  props: ["text", "value", "reverse"],
  data() {
    return {
      email: "",
      password: "",
      errors: [],
      loading: false,
    };
  },
  methods: {
    submit: async function (event) {
      event.preventDefault();
      console.log(event);
      this.$emit("sign_in_request", {
        email: this.email,
        password: this.password,
      });
    },
    handle_sign_up_click: function () {
      this.$emit("go_to_sign_up_request");
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
    <h2 class="login__title">Sign In</h2>
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
      v-model="email"
      :disabled="loading"
      placeholder="Email"
    />
    <input
      required
      type="password"
      name="password"
      class="appearance-none border border-grey focus:shadow-outline focus:outline-none leading-tight px-3 py-2 rounded text-grey-darker w-full"
      v-model="password"
      :disabled="loading"
      placeholder="Password"
    />
    <div class="login__redirect">
      or
      <span v-on:click="handle_sign_up_click">Sign Up</span>
    </div>
    <input
      type="submit"
      value="Sign In"
      class="login__button cursor-pointer bg-blue focus:outline-none focus:shadow-outline hover:bg-blue-dark px-4 py-2 rounded text-white"
    />
  </form>
</template>

<style>
.login {
  padding: 24px 24px;
}

.login__title {
  font-size: 25px;
  color: #337ab7;
  font-weight: bold;
  margin: 0px 0px 15px 0px;
}
.login__error {
  word-break: break-word;
  margin: 0px 0px 5px 0px;
}
.login input {
  font-size: 16px;
  margin: 5px 0px 5px 0px;
}
.login__redirect {
  color: rgba(0, 0, 0, 0.8);
  font-size: 14px;
  margin: 5px 0px 0px 0px;
}
.login__redirect span {
  text-decoration: none !important;
  color: #337ab7;
  font-size: 12px;
  font-weight: normal;
  letter-spacing: 0.4px;
  cursor: pointer;
}
.login__button {
  width: 100%;
  height: 38px;
  margin: 20px 0px 0px 0px !important;
}
</style>
