<template>
	<div class="navbar_section">
		<div class="navbar_section_header">{{ header }}</div>
		<slot></slot>
	</div>
</template>

<script>
	export default {
		props: {
			header: {
				type: String,
				required: true
			}
		}
	}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
	@import "@/scss/NavBar.scss";

	.navbar_section {
		align-items: center;
		border-bottom: 1px solid $NavBar_border;
		color: $NavBar_primary_color;
		padding: 12px;
		font-weight: bolder;
		font-size: 1em;
		text-decoration: none;
	}

	.navbar_section_header {
		padding-bottom: .5em;
	}
</style>

