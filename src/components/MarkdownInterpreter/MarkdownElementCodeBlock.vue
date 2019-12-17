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
				if(this.element.token === '```')
					return this.element.content[0];
				return "";
			},
			contentString: function() {
				var content = ""
				if(this.element.token === '```' && this.element.content.length > 1)
					for(var i = 1; i < this.element.content.length; i++)
					{
						if(this.element.content[i].token === '\n')
							content = content.concat('\n');
						else
							content = content.concat(this.element.content[i].content);
					}
				return content;
			}
		}
	}
</script>
