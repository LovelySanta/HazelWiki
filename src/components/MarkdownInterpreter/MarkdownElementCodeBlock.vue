<template>
	<pre><code>{{ contentString }}</code></pre>
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
			contentLanguage: function() {
				if(this.element.token === '```' && this.element.content.length > 1 && this.element.content[0].token === 'TXT')
					return this.element.content[0].content;
				return "";
			},
			contentElements: function() {
				if(this.element.token === '```' && this.element.content.length > 1)
					return this.element.content.slice(1);
				return [];
			},
			contentString: function() {
				var content = ""
				for(var i = 0; i < this.contentElements.length; i++)
				{
					if(this.contentElements[i].token === '\n')
						content = content.concat('\n');
					else
						content = content.concat(this.contentElements[i].content);
				}
				return content;
			}
		}
	}
</script>
