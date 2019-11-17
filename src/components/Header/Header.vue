<template>
	<div class="header">
		<HeaderButton eventName='navbar-toggleVisibile' icon='menu' label='' />
		<HeaderLabel icon='home' label='Pagetitle' />
	</div>
</template>

<script>
	import HeaderLabel from "./HeaderLabel.vue";
	import HeaderButton from "./HeaderButton.vue";

	export default {
		components: {
			HeaderLabel,
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
		display: flex;
	}
</style>