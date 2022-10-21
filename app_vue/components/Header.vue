<template>
	<header class="header">
		<div class="container">
			<div class="header__inner">
				<div class="header__menu-icon menu-icon" @click="clickMenu">
					<span></span>
				</div>
				<div class="header__logo logo">
					<span>YouTube Detector</span>
				</div>
				<div
					class="header__popup-close popup-close"
					@click="$emit('clickClose')">
					<button>&times;</button>
				</div>
			</div>
		</div>
	</header>
</template>

<script>
export default {
	emits: ["clickMenu", "clickClose"],
	methods: {
		clickMenu(event) {
			event.stopPropagation();

			this.$emit("clickMenu");
		},
	},
};
</script>

<style></style>
