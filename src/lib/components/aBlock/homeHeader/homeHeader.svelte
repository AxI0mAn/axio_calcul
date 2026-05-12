<script>
	// src/lib/components/aBlock/homeHeader/homeHeader.svelte
	// ------------- ссылки с учётом локализации в будущем

	// @ts-ignore

	// ----------
	import NavBurger from '$lib/components/NavBurger/NavBurger.svelte';
	import InstallReady from '$lib/components/Links/LinkInstallReady.svelte';
</script>

<header class="home__header">
	<div><NavBurger /></div>
	<p class="appNameInHeader font-digits">axio mobile calculator</p>
	<div class="installReadyWrap"><InstallReady customClass="mainHeaderInstallLink" /></div>
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
