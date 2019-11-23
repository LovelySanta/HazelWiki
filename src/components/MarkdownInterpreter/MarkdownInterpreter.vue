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
				this.compileSource(response.data);
			}).catch((error) => {
				console.log(error);
			});
		},
		methods: {
			compileSource: (src) => {
				// https://blog.beezwax.net/2017/07/07/writing-a-markdown-compiler/
				//console.log(src);
				parser.setSource(src);
				parser.parseSource();
			}
		}
	}
</script>