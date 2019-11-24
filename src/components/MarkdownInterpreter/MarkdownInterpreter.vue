<template>
	<div class="md-container">

	</div>
</template>

<script>
	import axios from 'axios'
	import MarkdownParser from './MarkdownParser.js'

	const parser = new MarkdownParser();

	export default {
		props: {
			src: {
				type: String,
				required: true
			}
		},
		data () {
			return {
			}
		},
		mounted() {
			axios({
				url: this.src,
				method: 'GET'
			}).then((response) => {
				parser.setSource(response.data);
				this.compileSource();
			}).catch((error) => {
				console.log(error);
			});
		},
		methods: {
			compileSource: () => {
				// https://blog.beezwax.net/2017/07/07/writing-a-markdown-compiler/
				//parser.log();
				parser.parseSource();
				parser.log();
			}
		}
	}
</script>