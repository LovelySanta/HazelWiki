<template>
	<div>
		<NavBar :toc="navBarLayout" />
		<Header />
		<router-view/>
	</div>
</template>

<script>
	import NavBar from './components/Navbar/Navbar';
	import Header from './components/Header/Header';

	import '../node_modules/materialize-css/dist/css/materialize.min.css';
	import '../node_modules/materialize-css/dist/js/materialize.min.js';

	const navBarLayout = require('./assets/NavBarLayout.json');

	export default {
		name: 'App',
		data() {
			return {
				navBarLayout: navBarLayout,
			}
		},
		components: {
			Header,
			NavBar,
		}
	}
</script>
