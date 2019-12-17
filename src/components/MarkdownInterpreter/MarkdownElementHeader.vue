<template>
	<span>
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
	export default {
		props: {
			element: {
				type: Object,
				required: true
			}
		},
		components: {
			'markdown-element' : () => import('./MarkdownElement.vue') // Recursive dependency
		},
		computed: {
			contentElements: function() {
				if(this.element.token === '#' && this.element.content.length > 1)
					return this.element.content.slice(1);
				return [];
			}
		}
	}
</script>
