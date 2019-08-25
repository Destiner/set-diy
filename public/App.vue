<template>
	<div id="app">
		<div id="left">
		</div>
		<div id="center">
			<div class="nav-bar">
				<div>
					<div class="nav-option">
						<router-link to="/">Main</router-link>
					</div>
				</div>
			</div>
			<br>
			<router-view/>
		</div>
		<div id="right">
		</div>
	</div>
</template>

<style>
@import url('https://fonts.googleapis.com/css?family=Roboto');

/*==================================================
  Basics
  ==================================================*/

body {
	font-family: 'Roboto', -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
	font-size: 18px;
}
</style>
