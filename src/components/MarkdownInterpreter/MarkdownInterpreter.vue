<template>
	<div class="md-container">

	</div>
</template>

<script>
	import axios from 'axios'

	export default {
		props: {
			src: {
				type: String,
				required: true
			}
		},
		data () {
			return {
			}
		},
		methods: {
			requestSource: function(callbackFn) {
				axios({
					url: this.src,
					method: 'GET'
				}).then((response) => {
					callbackFn(response.data);
				}).catch((error) => {
					console.log(error);
				});
			},
			compileSource: function(src) {
				console.log(src);
			},
		},
		mounted() {
			this.requestSource(this.compileSource);
		}
	}
</script>