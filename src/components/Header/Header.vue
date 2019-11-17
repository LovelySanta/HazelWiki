<template>
	<div class="header">
		<HeaderButton icon="menu" />
	</div>
</template>

<script>
	import HeaderButton from "./HeaderButton.vue";

	export default {
		components: {
			HeaderButton
		}
	}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
	@import "@/scss/Header.scss";

	.header {
		top: 0;
		left: 0;
		height: $Header_height;
		width: 100%;
		margin: 0;
		background: $Header_background;
	}
</style>