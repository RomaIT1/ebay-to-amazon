<template>
	<aside :class="['sidebar', isOpen ? 'active' : '']" ref="sidebar">
		<div class="sidebar__inner">
			<ul class="sidebar__list list">
				<li v-for="item of listItems" :key="item" class="list__item">
					<a href="#" @click="itemClick($event, item)">{{ item }}</a>
					<!-- <label>
						<span>Visible graph:</span>
						<input
							@change="visibleChange"
							v-model="isVisible"
							type="checkbox" />
					</label> -->
				</li>
			</ul>
		</div>
	</aside>
</template>

<script>
export default {
	emits: ["clickToNowhere", "visibleGraph", "invisibleGraph", "itemClick"],
	data() {
		return {
			isVisible: false,
			listItems: ["main", "config"],
		};
	},
	mounted() {
		document.addEventListener("click", this.documentClick);
	},
	methods: {
		documentClick(event) {
			if (!this.isOpen) return;

			const target = event.target;
			const sidebar = this.$refs.sidebar;

			if (sidebar !== target && !sidebar.contains(target)) {
				this.$emit("clickToNowhere");
			}
		},
		visibleChange(event) {
			if (event.target.checked) {
				this.$emit("visibleGraph");
				return;
			}

			this.$emit("invisibleGraph");
		},
		itemClick(event, item) {
			event.preventDefault();

			this.$emit("itemClick", item);
		},
	},
	props: {
		isOpen: {
			require: true,
			type: Boolean,
		},
	},
};
</script>

<style></style>
