<template>
	<span v-if="element.token === 'TXT'">
		{{ element.content }}
	</span>
</template>

<script>
	export default {
		props: {
			element: {
				type: Object,
				required: true
			}
		}
	}
</script>
