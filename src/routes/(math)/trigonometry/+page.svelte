<script>
	// src/routes/(math)/trigonometry/+page.svelte

	import MathPageLayout from '$lib/components/aPage/MathPageLayout.svelte';
	import CornerSwitchTrigon from '$lib/components/Btn/BtnBlockMath/CornerSwitchTrigon.svelte';
	import BtnBlockOpTrigon from '$lib/components/Btn/BtnBlockMath/BtnBlockOpTrigon.svelte';
	import AdvertisementLine2 from '$lib/components/advertisement/advertisementLine2.svelte';

	import BtnBlockDigit from '$lib/components/Btn/BtnBlockBase/BtnBlockDigit.svelte';
	import BtnBlockOp from '$lib/components/Btn/BtnBlockBase/BtnBlockOp.svelte';
	import DisText from '$lib/components/Display/DisMath/DisText.svelte';
</script>

<svelte:head>
	<meta
		name="description"
		content="The Trigonometry Calculator provides a fast and convenient way to calculate common trigonometric, inverse trigonometric, and hyperbolic functions."
	/>

	<meta property="og:title" content="amoca - Fast Online Trigonometry Calculator." />
	<meta
		property="og:description"
		content="The Trigonometry Calculator provides a fast and convenient way to calculate common trigonometric, inverse trigonometric, and hyperbolic functions."
	/>

	<meta name="twitter:title" content="amoca - Fast Online Trigonometry Calculator." />
	<meta
		name="twitter:description"
		content="The Trigonometry Calculator provides a fast and convenient way to calculate common trigonometric, inverse trigonometric, and hyperbolic functions."
	/>

	<meta
		name="twitter:image"
		content="https://axi0man.github.io/axio_calcul/ogImage/og_trigon.png"
	/>
	<link rel="canonical" href="https://axi0man.github.io/axio_calcul/trigonometry/" />
	<meta property="og:url" content="https://axi0man.github.io/axio_calcul/trigonometry/" />

	<title>amoca | Trigonometry Calculator</title>
</svelte:head>

<MathPageLayout nowMode="TRIGONOMETRY">
	{#snippet display()}
		<DisText />
	{/snippet}

	{#snippet btnDigit()}
		<BtnBlockDigit />
	{/snippet}

	{#snippet buttons()}
		<CornerSwitchTrigon />
		<BtnBlockOpTrigon />
	{/snippet}

	{#snippet btnBaseOp()}
		<BtnBlockOp />
	{/snippet}

	{#snippet ads()}
		<AdvertisementLine2 />
	{/snippet}
</MathPageLayout>
