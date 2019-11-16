<template>
	<div class="navbar navbar--visible">
		<div class="navbar_section">
			Navigation bar
		</div>

		<div class="navbar_section">
			<div class="navbar_section_header">Testing</div>
			<router-link to="/" class="navbar_item">
				<span class="material-icons">home</span>Home
			</router-link>
			<router-link to="/About" class="navbar_item">
				<span class="material-icons">info</span>About
			</router-link>
		</div>
		
		<div class="navbar_section">
			<div class="navbar_section_header">More testing</div>
			<a href="#" class="navbar_item">
				<span class="material-icons">question_answer</span>Forum
			</a>
			<a href="#" class="navbar_item">
				<span class="material-icons">menu_book</span>API
			</a>
		</div>
	</div>
</template>

<script>
	function navbar_toggleVisibile()
	{	/* toggle navbar visibility */
		document.querySelector(".navbar").classList.toggle("navbar--visible");
	}
</script>

<style>
	.navbar {
		position: fixed;
		top: 0;
		width: 200px;
		height: 100%;
		background: #1b1c1d;
		border-right: 2px solid #1b1c1d;
		/* navbar not visible */
		left: -200px;
		opacity: 0;
		transition: left 0.25s ease-in-out, opacity 0.25s ease-in-out;
	}

	.navbar--visible {
		/* navbar visible */
		left: 0;
		opacity: 1;
	}

	.navbar_section {
		align-items: center;
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
		background: inherit;
		color: #ffffff;
		padding: 12px;
		font-weight: bolder;
		font-size: 1em;
		text-decoration: none;
	}

	.navbar_section_header {
		align-items: inherit;
		background: inherit;
		color: inherit;
		padding-bottom: .5em;
		font-weight: inherit;
		font-size: inherit;
		text-decoration: inherit;
	}

	.navbar_item {
		display: flex;
		align-items: inherit;
		background: inherit;
		color: rgba(255, 255, 255, .5);
		font-weight: inherit;
		font-size: 0.85em;
		text-decoration: inherit;
	}

	.navbar_item .material-icons {
		margin-right: 12px;
	}

	.navbar_item:hover {
		color: #ffffff;
	}

	.navbar_item:active {
		background: rgba(255, 255, 255, 0.08);
	}
</style>