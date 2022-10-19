<script>
export default {};
</script>

<template>
	<section class="config-page">
		<div class="container">
			<div class="config-page__inner">
				<div class="config-page__title title">
					<h2 class="title__main">Config</h2>
				</div>
				<form class="config-page__controls config-controls form">
					<label class="form__field field">
						<span class="field__label">Sound message</span>
						<input
							class="field__input field__input--checkbox"
							type="checkbox" />
					</label>
					<label class="form__field field">
						<span class="field__label">Count frames</span>
						<input class="field__input" type="number" min="0" />
					</label>
					<label class="form__field field">
						<span class="field__label">Count second</span>
						<input class="field__input" type="number" min="0" />
					</label>
				</form>
			</div>
		</div>
	</section>
</template>

<style></style>
