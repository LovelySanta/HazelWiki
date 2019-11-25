<template>
	<div class="md-container">

	</div>
</template>

<script>
	import axios from 'axios'
	import MarkdownParser from './MarkdownParser'
	import MarkdownTokenizer from './MarkdownTokenizer'

	const tokenizer = new MarkdownTokenizer();
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
				// Create tokens from the src
				parser.setTokens(tokenizer.tokenize(src));
				//parser.logTokens();

				// Parse the tokens to create a recursive tree
				parser.cleanTokens();
				parser.compressTokens();
				parser.logTokens();

				parser.parseTokens();
				parser.logElements();
			}
		}
	}
</script>