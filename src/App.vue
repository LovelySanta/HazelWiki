<template>
	<div>
		<NavBar :toc="navBarContent" />
		<router-view/>
	</div>
</template>

<script>
	import NavBar from './components/Navbar/Navbar';

	import '../node_modules/materialize-css/dist/css/materialize.min.css';
	import '../node_modules/materialize-css/dist/js/materialize.min.js';

	export default {
		name: 'App',
		data() {
			return {
				navBarContent: [
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
				],
			}
		},
		components: {
			NavBar
		}
	}
</script>
