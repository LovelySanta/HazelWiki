<template>
	<i>
		<markdown-element v-for="(contentElement, contentIndex) in element.content"
					:key="contentIndex"
					:element="contentElement"
		/>
	</i>
</template>

<script>
	export default {
		props: {
			element: {
				type: Object,
				required: true
			}
		},
		components: {
			'markdown-element' : () => import('./MarkdownElement.vue') // Recursive dependency
		}
	}
</script>
