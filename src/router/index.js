import Vue from 'vue'
import Router from 'vue-router'

import BasicPage from './../views/BasicPage.vue'
import Testpage from './../views/Testpage.vue'
import PageNotFound from './../views/PageNotFound.vue'

Vue.use(Router)

export default new Router({
	mode: 'history',
	routes: [
		{
			path: "*",
			component: PageNotFound
		},
		{
			path: '/testpage',
			component: Testpage
		},

		/********************************************************
		* BASICS
		********************************************************/
		{
			path: '/',
			component: BasicPage,
			props: {
				src: "./static/content/Home.md"
			}
		},
		{
			path: '/Features',
			component: BasicPage,
			props: {
				src: "./static/content/FutureFeatures.md"
			}
		},
		{
			path: '/GettingStarted',
			component: BasicPage,
			props: {
				src: "./static/content/GettingStarted.md"
			}
		},
		{
			path: '/SystemRequirements',
			component: BasicPage,
			props: {
				src: "./static/content/SystemRequirements.md"
			}
		},
		{
			path: '/BuildingHazel',
			component: BasicPage,
			props: {
				src: "./static/content/BuildingHazel.md"
			}
		},
		{
			path: '/FirstProject',
			component: BasicPage,
			props: {
				src: "./static/content/FirstProject.md"
			}
		},

		/********************************************************
		* ENGINE
		********************************************************/
		{
			path: '/Benchmarking',
			component: BasicPage,
			props: {
				src: "./static/content/Benchmarking.md"
			}
		},
		{
			path: '/LayerSystem',
			component: BasicPage,
			props: {
				src: "./static/content/LayerSystem.md"
			}
		},
		{
			path: '/EventSystem',
			component: BasicPage,
			props: {
				src: "./static/content/EventSystem.md"
			}
		},
	]
})
