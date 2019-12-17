<template>
	<span v-if="element.token === '#'">
		<h1 v-if="element.content[0] === 1">
			<markdown-element v-for="(contentElement, contentIndex) in contentElements"
								:key="contentIndex"
								:element="contentElement"
			/>
		</h1>
		<h2 v-if="element.content[0] === 2">
			<markdown-element v-for="(contentElement, contentIndex) in contentElements"
								:key="contentIndex"
								:element="contentElement"
			/>
		</h2>
		<h3 v-if="element.content[0] === 3">
			<markdown-element v-for="(contentElement, contentIndex) in contentElements"
								:key="contentIndex"
								:element="contentElement"
			/>
		</h3>
		<h4 v-if="element.content[0] === 4">
			<markdown-element v-for="(contentElement, contentIndex) in contentElements"
								:key="contentIndex"
								:element="contentElement"
			/>
		</h4>
		<h5 v-if="element.content[0] === 5">
			<markdown-element v-for="(contentElement, contentIndex) in contentElements"
								:key="contentIndex"
								:element="contentElement"
			/>
		</h5>
		<h6 v-if="element.content[0] === 6">
			<markdown-element v-for="(contentElement, contentIndex) in contentElements"
								:key="contentIndex"
								:element="contentElement"
			/>
		</h6>
	</span>
</template>

<script>
	import MarkdownElement from "./MarkdownElement.vue";

	export default {
		props: {
			element: {
				type: Array,
				required: true
			}
		},
		components: {
			'markdown-element' : MarkdownElement,
		},
		computed: {
			contentElements: function() {
				if(this.element.token === '#' && this.element.content.length > 1)
				{
					return this.element.content.slice(1);
				} else {
					return [];
				}
			}
		}
	}
</script>
