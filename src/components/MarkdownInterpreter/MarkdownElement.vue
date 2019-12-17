<template>
	<span>
		<markdown-header    v-if="element.token === '#'"   :element="element"/>
		<markdown-paragraph v-if="element.token === 'p'"   :element="element"/>
		<markdown-newline   v-if="element.token === '\n'"  :element="element"/>
		<markdown-text      v-if="element.token === 'TXT'" :element="element"/>
		<markdown-bold      v-if="element.token === '**'"  :element="element"/>
		<markdown-italic    v-if="element.token === '*'"   :element="element"/>
	</span>
</template>

<script>
	import MarkdownElementHeader    from "./MarkdownElementHeader.vue";
	import MarkdownElementParagraph from "./MarkdownElementParagraph.vue";
	import MarkdownElementNewline   from "./MarkdownElementNewline.vue";
	import MarkdownElementText      from "./MarkdownElementText.vue";
	import MarkdownElementBold      from "./MarkdownElementBold.vue";
	import MarkdownElementItalic    from "./MarkdownElementItalic.vue";

	export default {
		props: {
			element: {
				type: Object,
				required: true
			}
		},
		components: {
			'markdown-header'    : MarkdownElementHeader,
			'markdown-paragraph' : MarkdownElementParagraph,
			'markdown-newline'   : MarkdownElementNewline,
			'markdown-text'      : MarkdownElementText,
			'markdown-bold'      : MarkdownElementBold,
			'markdown-italic'    : MarkdownElementItalic,
		}
	}
</script>
