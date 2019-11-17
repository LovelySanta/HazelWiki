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
	.navbar_section {
		align-items: center;
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
		background: inherit;
		color: #ffffff;
		padding: 12px;
		font-weight: bolder;
		font-size: 1em;
		text-decoration: none;
	}

	.navbar_section_header {
		align-items: inherit;
		background: inherit;
		color: inherit;
		padding-bottom: .5em;
		font-weight: inherit;
		font-size: inherit;
		text-decoration: inherit;
	}
</style>

