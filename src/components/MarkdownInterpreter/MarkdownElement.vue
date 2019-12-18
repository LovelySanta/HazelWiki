<template>
	<span>
		<!-- These must be on one line, otherwise it messes with code sections -->
		<md-h :element="element"/><md-p :element="element"/><md-nl :element="element"/><md-txt :element="element"/><md-b :element="element"/><md-i :element="element"/><md-c :element="element"/><md-cb :element="element"/><md-l :element="element"/><md-img :element="element"/>
	</span>
</template>

<script>
	import MarkdownElementHeader    from "./MarkdownElementHeader.vue";
	import MarkdownElementParagraph from "./MarkdownElementParagraph.vue";
	import MarkdownElementNewline   from "./MarkdownElementNewline.vue";
	import MarkdownElementText      from "./MarkdownElementText.vue";
	import MarkdownElementBold      from "./MarkdownElementBold.vue";
	import MarkdownElementItalic    from "./MarkdownElementItalic.vue";
	import MarkdownElementCode      from "./MarkdownElementCode.vue";
	import MarkdownElementCodeblock from "./MarkdownElementCodeblock.vue";
	import MarkdownElementLink      from "./MarkdownElementLink.vue";
	import MarkdownElementImage     from "./MarkdownElementImage.vue";

	export default {
		props: {
			element: {
				type: Object,
				required: true
			}
		},
		components: {
			'md-h'   : MarkdownElementHeader,
			'md-p'   : MarkdownElementParagraph,
			'md-nl'  : MarkdownElementNewline,
			'md-txt' : MarkdownElementText,
			'md-b'   : MarkdownElementBold,
			'md-i'   : MarkdownElementItalic,
			'md-c'   : MarkdownElementCode,
			'md-cb'  : MarkdownElementCodeblock,
			'md-l'   : MarkdownElementLink,
			'md-img' : MarkdownElementImage,
		}
	}
</script>
