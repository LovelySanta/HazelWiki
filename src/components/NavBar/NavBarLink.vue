<template>
	<router-link @click.native="closeNav" class="navbar_item" v-bind="attrs">
		<span class="material-icons">{{ iconName }}</span>{{ linkName }}
	</router-link>
</template>

<script>
	import { EventBus } from '@/main.js';

	export default {
		props: {
			iconName: {
				type: String,
				required: true
			},
			linkName: {
				type: String,
				required: true
			},
		},
		computed: {
			// Getting the to property out of the parent, and making sure it gets down to the router-link
			//
			// NOTE: In the future, the default should probably go to 404 if no route is given
			to() {
				return this.$attrs.to || "/"
			},
			// Redefine the attributes, so vue will net us set them in the child.
			attrs() {
				const { ...attrs } = this.$attrs;
				return attrs
			}
		},
		methods: {
			closeNav() {
				EventBus.$emit('navbar-closeVisibile');
			}
		}
	}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
	.navbar_item {
		display: flex;
		align-items: inherit;
		background: inherit;
		color: rgba(255, 255, 255, .5);
		font-weight: inherit;
		font-size: 0.85em;
		text-decoration: inherit;
	}

	.navbar_item .material-icons {
		margin-right: 12px;
	}

	.navbar_item:hover {
		color: #ffffff;
	}

	.navbar_item:active {
		background: rgba(255, 255, 255, 0.08);
	}
</style>

