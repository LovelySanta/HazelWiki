<template>
	<span v-if="element.token === 'TXT'">
		{{ element.content }}
	</span>
</template>

<script>
	export default {
		props: {
			element: {
				type: Array,
				required: true
			}
		}
	}
</script>
