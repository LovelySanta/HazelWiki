<template>
	<span>
		<markdown-text :element="element" />
		<markdown-header :element="element" />
	</span>
</template>

<script>
	import MarkdownElementText from "./MarkdownElementText.vue";
	import MarkdownElementHeader from "./MarkdownElementHeader.vue";

	export default {
		props: {
			element: {
				type: Object,
				required: true
			}
		},
		components: {
			'markdown-text' : MarkdownElementText,
			'markdown-header' : MarkdownElementHeader
		}
	}
</script>
