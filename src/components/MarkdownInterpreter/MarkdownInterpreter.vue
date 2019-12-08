<template>
	<div class="md-container">

	</div>
</template>

<script>
	import axios from 'axios'
	import MarkdownTokenizer from './MarkdownTokenizer'
	import MarkdownParser from './MarkdownParser'

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
				this.parseSource(this.tokenize(response.data));
			}).catch((error) => {
				console.log(error);
			});
		},
		methods: {
			tokenize: (src) => {
				return tokenizer.tokenize(src);
			},
			parseSource: (src) => {
				parser.setTokens(src);
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