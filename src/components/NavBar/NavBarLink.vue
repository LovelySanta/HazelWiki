<template>
	<router-link class="navbar_item" v-bind="attrs">
		<span class="material-icons">{{ iconName }}</span>{{ linkName }}
	</router-link>
</template>

<script>
    export default {
        props: {
            iconName: {
                String,
                required: true
            },
            linkName: {
                String,
                required: true
            },
        },
		computed: {
            // Getting the to property out of the parent, and making sure it gets down to the router-link
			//
			// NOTE: In the future, the default should probably go to 404 if no route is given
            to() {
                return this.$attrs.to || "/"
			},
			// Redefine the attributes, so vue will net us set them in the child.
			attrs() {
                const { ...attrs } = this.$attrs;
                return attrs
			}
		}
    }
</script>
