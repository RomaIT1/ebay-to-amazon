<script>
export default {
	emits: ["saveConfig"],
	props: {
		config: {
			require: true,
			type: Object,
		},
	},
	mounted() {
		this.sceneCount = this.config.sceneCount;
		this.secondInterval = this.config.secondInterval;
		this.soundMessage = this.config.soundMessage;
	},
	data() {
		return {
			soundMessage: false,
			sceneCount: "",
			secondInterval: "",
		};
	},
	methods: {
		save() {
			if (!this.sceneCount || !this.secondInterval) return;

			this.$emit("saveConfig", {
				sceneCount: this.sceneCount,
				secondInterval: this.secondInterval,
				soundMessage: this.soundMessage,
			});
		},
	},
};
</script>

<template>
	<section class="config-page">
		<div class="container">
			<div class="config-page__inner">
				<div class="config-page__title title">
					<h2 class="title__main">Config</h2>
				</div>
				<form
					@submit.prevent="save"
					class="config-page__controls config-controls form">
					<label class="form__field field">
						<span class="field__label">Sound message</span>
						<input
							class="field__input field__input--checkbox"
							type="checkbox"
							v-model="soundMessage" />
					</label>
					<label class="form__field field">
						<span class="field__label">Scene count</span>
						<input
							class="field__input"
							type="number"
							min="0"
							v-model="sceneCount" />
					</label>
					<label class="form__field field">
						<span class="field__label">Second interval</span>
						<input
							class="field__input"
							type="number"
							min="0"
							v-model="secondInterval" />
					</label>
					<button class="button button--primary" type="submit">
						Save
					</button>
				</form>
			</div>
		</div>
	</section>
</template>

<style></style>
