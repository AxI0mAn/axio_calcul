<script>
	// src/routes/(math)/basic/+page.svelte
	import MathPageLayout from '$lib/components/aPage/MathPageLayout.svelte';
	import BtnBlockOpBasic from '$lib/components/Btn/BtnBlockMath/BtnBlockOpBasic.svelte';
	import AdvertisementLine2 from '$lib/components/advertisement/advertisementLine2.svelte';

	import BtnBlockDigit from '$lib/components/Btn/BtnBlockBase/BtnBlockDigit.svelte';
	import BtnBlockOp from '$lib/components/Btn/BtnBlockBase/BtnBlockOp.svelte';
	import DisText from '$lib/components/Display/DisMath/DisText.svelte';
</script>

<svelte:head>
	<meta
		name="description"
		content="Use this calculator to perform everyday mathematical calculations quickly and accurately."
	/>

	<meta property="og:title" content="amoca - Fast Basic Calculator." />
	<meta
		property="og:description"
		content="Use this calculator to perform everyday mathematical calculations quickly and accurately."
	/>

	<meta name="twitter:title" content="amoca - Fast Basic Calculator." />
	<meta
		name="twitter:description"
		content="Use this calculator to perform everyday mathematical calculations quickly and accurately."
	/>

	<meta name="twitter:image" content="https://axi0man.github.io/axio_calcul/ogImage/og_basic.png" />
	<meta property="og:image" content="https://axi0man.github.io/axio_calcul/ogImage/og_basic.png" />
	<link rel="canonical" href="https://axi0man.github.io/axio_calcul/basic/" />
	<meta property="og:url" content="https://axi0man.github.io/axio_calcul/basic/" />

	<title>amoca | Basic Calculator</title>
</svelte:head>

<MathPageLayout nowMode="BASIC">
	{#snippet display()}
		<DisText />
	{/snippet}

	{#snippet btnDigit()}
		<BtnBlockDigit />
	{/snippet}

	{#snippet buttons()}
		<BtnBlockOpBasic />
	{/snippet}

	{#snippet btnBaseOp()}
		<BtnBlockOp />
	{/snippet}

	{#snippet ads()}
		<AdvertisementLine2 />
	{/snippet}
</MathPageLayout>
