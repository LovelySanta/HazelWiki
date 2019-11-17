<template>
	<transition name = "navbar_fade">
		<div class="navbar" v-show="visible">
			<navbar-section v-for="(section, index) in content" :key="index"
				:header="section.header">
				<navbar-link v-for="(link, index) in section.links" :key="index"
					:to="link.to"
					:icon-name="link.icon"
					:link-name="link.name"
				/>
			</navbar-section>
		</div>
	</transition>
</template>

<script>
	import { EventBus } from '@/main.js';
	import NavBarSection from './NavBarSection.vue'
	import NavBarLink from './NavBarLink.vue'

	export default {
		data() {
			return {
				visible: false,
				content: [
					{
						header: "Navigation bar"
					},
					{
						header: "Testing",
						links: [
							{ to: "/"     , icon: "home", name: "Home"},
							{ to: "/About", icon: "info", name: "About"},
						]
					},
					{
						header: "More testing",
						links: [
							{ to: "#", icon: "question_answer", name: "Forum"},
							{ to: "#", icon: "menu_book"      , name: "API"},
						]
					}
				]
			}
		},
		created() {
			EventBus.$on('navbar-toggleVisibile', () => {
				this.visible = !this.visible;
			});

			EventBus.$on('navbar-closeVisibile', () => {
				this.visible = false;
			});
		},
		components: {
			'navbar-section': NavBarSection,
			'navbar-link': NavBarLink
		}
	}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
	.navbar {
		position: fixed;
		top: 0px;
		left: 0px;
		width: 200px;
		height: 100%;
		background: #1b1c1d;
		border-right: 2px solid #1b1c1d;
	}

	.navbar_fade-enter-active,
	.navbar_fade-leave-active {
		transition: opacity .3s ease-in-out, transform 0.3s ease;
	}

	.navbar_fade-enter,
	.navbar_fade-leave-to {
		opacity: 0;
		left: -200px;
	}
</style>
