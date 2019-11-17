<template>
	<transition name = "navbar_fade">
		<div class="navbar" v-show="visible">
			<navbar-section header="Navigation bar" />

			<navbar-section header="Testing">
				<navbar-link to="/" icon-name="home" link-name="Home" />
				<navbar-link to="/About" icon-name="info" link-name="About" />
			</navbar-section>

			<navbar-section header="More testing">
				<navbar-link to="/" icon-name="question_answer" link-name="Forum" />
				<navbar-link to="/About" icon-name="menu_book" link-name="API" />
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
                visible: false
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
