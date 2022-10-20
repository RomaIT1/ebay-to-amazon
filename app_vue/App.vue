<script>
import Header from "./components/Header.vue";
import Sidebar from "./components/Sidebar.vue";
import ConfigPage from "./components/ConfigPage.vue";
import MainPage from "./components/MainPage.vue";

import Util from "chromane/js/Util.js";

export default {
	data() {
		return {
			isOpenSidebar: false,
			currentPage: "main",
			config: {},
		};
	},
	async mounted() {
		window.util = new Util();

		window.parent_wrap = window.util.create_window_wrap(
			window,
			window.parent
		);

		this.config = await this.getConfig();
	},
	methods: {
		async getConfig() {
			return await window.parent_wrap.exec("getConfig");
		},
		closeSidebar() {
			this.isOpenSidebar = false;
		},
		openSidebar() {
			this.isOpenSidebar = true;
		},
		visibleGraph() {
			window.parent_wrap.exec("visibleGraph", { visible: true });
		},
		invisibleGraph() {
			window.parent_wrap.exec("visibleGraph", { visible: false });
		},
		manageSidebar(item) {
			this.isOpenSidebar = false;
			this.currentPage = item;
		},
		defineConfig(data) {
			this.config.sceneCount = data.sceneCount;
			this.config.secondInterval = data.secondInterval;
			this.config.soundMessage = data.soundMessage;

			window.parent_wrap.exec("defineConfig", data);
			this.redirect("main");
		},
		redirect(page) {
			this.currentPage = page;
		},
	},
	components: {
		Header,
		Sidebar,
		ConfigPage,
		MainPage,
	},
};
</script>

<template>
	<div id="app">
		<Header @clickMenu="openSidebar"></Header>
		<main class="main">
			<component
				:is="currentPage[0].toUpperCase() + currentPage.slice(1) + 'Page'"
				@saveConfig="defineConfig"
				:config="config"></component>
			<Sidebar
				:isOpen="isOpenSidebar"
				@clickToNowhere="closeSidebar"
				@visibleGraph="visibleGraph"
				@invisibleGraph="invisibleGraph"
				@itemClick="manageSidebar"></Sidebar>
		</main>
	</div>
</template>

<style>
@import url("./styles//reset.css");
@import url("./styles/fonts.css");
@import url("./styles/base.css");

@import url("./styles/components/header.css");
@import url("./styles/components/sidebar.css");
@import url("./styles/components/config-page.css");
@import url("./styles/components/main-page.css");
</style>
