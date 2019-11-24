<template>
	<div class="container">
		<!--<markdown-page src="https://raw.githubusercontent.com/TheCherno/Hazel/master/README.md" />-->
		<markdown-page src="./static/content/Testfile.md" />
	</div>
</template>

<script>
	import MarkdownInterpreter from '@/components/MarkdownInterpreter/MarkdownInterpreter.vue';

	export default {
		data() {
			return {
			}
		},
		methods: {
			toggleNavbar() {
				EventBus.$emit('navbar-toggleVisibile');
			}
		},
		components: {
			'markdown-page': MarkdownInterpreter,
		}
	}
</script>
