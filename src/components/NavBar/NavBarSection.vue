<template>
	<div class="navbar_section">
		<div class="navbar_section_header">{{ header }}</div>
		<slot></slot>
	</div>
</template>

<script>
    export default {
        props: {
            header: {
                String,
				required: true
            },
		}
    }
</script>
