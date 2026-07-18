<script>
	// src/lib/components/aBlock/homeHeader/homeHeader.svelte

	// @ts-ignore

	// ----------
	import NavBurger from '$lib/components/NavBurger/NavBurger.svelte';
	import LinkInstallReady from '$lib/components/Links/LinkInstallReady.svelte';
</script>

<header class="home__header">
	<div><NavBurger /></div>
	<p class="appNameInHeader font-digits">amoca - a mobile calculator</p>
	<div class="installReadyWrap"><LinkInstallReady customClass="mainHeaderInstallLink" /></div>
</header>

<style lang="scss">
	.home__header {
		background-color: $clr-coral; // Используем наш утвержденный акцент
		width: 100%;
		padding: 0.25rem 0.5rem;
		display: flex;
		flex-flow: row nowrap;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;

		// Текст внутри коралловой шапки должен быть темным для контраста
		color: $clr-bg;

		.appNameInHeader {
			text-align: center;
			font-size: 1.5rem;
			font-weight: 777;
		}

		.installReadyWrap {
			min-height: 100%;
			min-width: 3rem;
			aspect-ratio: 1/1;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
</style>
