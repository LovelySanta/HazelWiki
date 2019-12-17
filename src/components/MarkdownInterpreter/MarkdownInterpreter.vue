<template>
	<div class="markdown-body">
		<markdown-element v-for="(element, index) in elements"
							:key="index"
							:element="element"
		/>
	</div>
</template>

<script>
	import axios from 'axios'
	import MarkdownParser from './MarkdownParser'
	import MarkdownElement from './MarkdownElement.vue';

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
				elements: []
			}
		},
		mounted() {
			axios({
				url: this.src,
				method: 'GET'
			}).then((response) => {
				this.elements = this.parse(response.data);
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
				//parser.logElements();
				return parser.getElements();
			}
		},
		components: {
			'markdown-element': MarkdownElement
		}
	}
</script>

<style lang="scss" rel="stylesheet/scss">
	@import "@/scss/MarkdownInterpreter.scss";

	.markdown-body {
		color: $MarkdownInterpreter_color;

		font-family: $MarkdownInterpreter_font-family;
		font-size: $MarkdownInterpreter_font-size;
		font-weight: $MarkdownInterpreter_font-weight;

		line-height: $MarkdownInterpreter_line-height;
	}
</style>
