<script>
	import BtnBack from '$lib/components/Btn/BtnBack.svelte';
	import { appStore } from '$lib/store/appStore.svelte';
	import { installPwaAction } from '$lib/utils/initPwaLogic';
	import BtnText from '$lib/components/Btn/BtnText.svelte';
</script>

<header class="header">
	<BtnBack />
	<h1 class="headerSlogan">contact us</h1>
</header>

<style lang="scss">
	.install-page {
		padding: 2rem;
		min-height: 100vw;
		color: $clr-text-main;
		line-height: 1.4rem;

		margin: 0 auto;
		max-width: 100vmin;
		margin-bottom: 25px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.header {
		display: flex;
		flex-flow: row wrap;
		justify-content: flex-start;
		align-items: center;
		padding: 2rem;
		gap: 2rem;

		.headerSlogan {
			color: $clr-coral;
			font-size: 3rem;
			display: inline-block;
		}
	}
	@media (max-height: 500px) and (orientation: landscape),
		(max-width: 500px) and (orientation: portrait) {
		.headerSlogan {
			font-size: 2rem;
		}
	}
</style>
