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
				this.createElements(this.createTokens(response.data));
				console.log(tokenizer.tokenize(response.data));
				console.log(tokenizer.untokenize(tokenizer.tokenize(response.data)));
			}).catch((error) => {
				console.log(error);
			});
		},
		methods: {
			createTokens: (src) => {
				return tokenizer.tokenize(src);
			},
			createElements: (src) => {
				parser.setTokens(src);
				//parser.logTokens();
				parser.cleanupTokens();
				//parser.logTokens();

				// Parse the tokens to create a recursive tree
				parser.createElements();
				//parser.logElements();
				return parser.getElements();
			}
		}
	}
</script>