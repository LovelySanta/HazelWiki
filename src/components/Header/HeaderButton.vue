<template>
	<a class="header_button" v-on:click="buttonAction">
		<span class="material-icons">{{ icon }}</span>test
	</a>
</template>

<script>
	export default {
		props: {
			icon: {
				type: String,
				required: false,
				default: ""
			},
			eventName: {
				type: String,
				required: false,
				default: "Unknown"
			}
		},
		methods: {
			buttonAction() {
				console.log("testing event");
				this.$emit(eventName);
			}
		}
	}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
	@import "@/scss/Header.scss";

	.header_button {
		border-right: 1px solid $Header_border;
		padding: $Header_padding;
		color: $Header_color;
		margin: 0;
		text-decoration: none;
		//vertical-align: middle;
	}

	.header_button:hover {
		background: $Header_border;
	}
</style>