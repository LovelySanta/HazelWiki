<template>
	<a class="header_button" v-on:click="buttonAction(eventName)">
		<span class="material-icons" v-if="icon !== ''">{{ icon }}</span>
		<span class="header_button_spacer" v-if="icon !== '' && label !== ''" />
		<span v-if="label !== ''">{{ label }}</span>
	</a>
</template>

<script>
	import { EventBus } from '@/main.js'

	export default {
		props: {
			eventName: {
				type: String,
				required: true
			},
			icon: {
				type: String,
				required: false,
				default: ''
			},
			label: {
				type: String,
				required: false,
				default: ''
			},
		},
		methods: {
			buttonAction(eventName) {
				EventBus.$emit(eventName);
			}
		}
	}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
	@import "@/scss/Header.scss";

	.header_button {
		border-right: 1px solid $Header_border;
		color: $Header_color;
		margin: 0;
		text-decoration: none;
		padding: $Header_padding;
		height: 100%;
		display: inline-flex;
		align-items: center;
		cursor: pointer;
	}

	.header_button:hover {
		background: $Header_border;
	}

	.header_button_spacer {
		margin-right: 6px;
	}
</style>
