<template>
	<div class="md-container">

	</div>
</template>

<script>
	import axios from 'axios'
	import MarkdownParser from './MarkdownParser'

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
				this.parse(response.data);
			}).catch((error) => {
				console.log(error);
			});
		},
		methods: {
			parse: (src) => {
				parser.setSrc(src);

				// Find tokens in the source
				parser.createTokens(src);
				parser.cleanupTokens();
				//parser.logTokens();

				// Create elements from tokens
				parser.createElements();
				parser.logElements();
				return parser.getElements();
			}
		}
	}
</script>