<template>
	<router-link @click.native="closeNav" class="navbar_link" v-bind="attrs">
		<span class="material-icons">{{ iconName }}</span>{{ linkName }}
	</router-link>
</template>

<script>
	import { EventBus } from '@/main.js'

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
			// Redefine the attributes, so vue will let us set them in the child.
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
	@import "@/scss/NavBar.scss";

	.navbar_link {
		display: flex;
		color: $NavBar_secundary_color;
		font-size: 0.85rem;
	}

	.navbar_link:hover {
		color: $NavBar_primary_color;
	}

	.navbar_link:active {
		background: $NavBar_border;
	}

	.navbar_link .material-icons {
		margin-right: 12px;
	}
</style>

