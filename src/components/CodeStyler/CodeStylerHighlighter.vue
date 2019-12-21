<template>
	<code>{{ src }}</code>
</template>

<script>
	import CodeParser from './CodeParser/CodeParser.js'

	const parser = new CodeParser();

	export default {
		props: {
			src: {
				type: String,
				required: true
			},
			language: {
				type: String,
				required: false,
				default: ""
			}
		},
		mounted() {
			// For debug purpose only
			parser.setLanguage(this.language);
			console.log(parser.parse(this.src));
		},
		computed: {
			elements: function() {
				parser.setLanguage(this.language);
				return parser.parse(this.src);
			}
		},
	}
</script>


<style scoped lang="scss" rel="stylesheet/scss">
	@import "@/scss/CodeStyler.scss";

	code{
		display: inline;

		font-family: $CodeStyler_font-family;
		font-size: $CodeStyler_font-size;
		font-weight: $CodeStyler_font-weight;
		font-stretch: 100%;
		font-style: normal;
		font-variant-caps: normal;

		text-align: left;
		word-wrap: break-word;
		white-space: pre-wrap;
		page-break-inside: avoid;
		tab-size: $CodeStyler_tab-size;
	}

</style>
