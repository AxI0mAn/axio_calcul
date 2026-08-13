<script>
	// src/routes/(math)/engineer/+page.svelte
	import MathPageLayout from '$lib/components/aPage/MathPageLayout.svelte';
	import BtnBlockOpEngineer from '$lib/components/Btn/BtnBlockMath/BtnBlockOpEngineer.svelte';
	import AdvertisementGor from '$lib/components/advertisement/advertisementGor.svelte';

	import BtnBlockDigit from '$lib/components/Btn/BtnBlockBase/BtnBlockDigit.svelte';
	import BtnBlockOp from '$lib/components/Btn/BtnBlockBase/BtnBlockOp.svelte';
	import DisText from '$lib/components/Display/DisMath/DisText.svelte';
</script>

<svelte:head>
	<meta name="description" content="Advanced Scientific and Engineering Calculator." />

	<meta property="og:title" content="amoca - Fast Online Engineering Calculator." />
	<meta property="og:description" content="Advanced Scientific and Engineering Calculator." />

	<meta name="twitter:title" content="amoca - Fast Online Engineering Calculator." />
	<meta name="twitter:description" content="Advanced Scientific and Engineering Calculator." />

	<meta
		name="twitter:image"
		content="https://axi0man.github.io/axio_calcul/ogImage/og_engineer.png"
	/>
	<meta
		property="og:image"
		content="https://axi0man.github.io/axio_calcul/ogImage/og_engineer.png"
	/>
	<link rel="canonical" href="https://axi0man.github.io/axio_calcul/engineer/" />
	<meta property="og:url" content="https://axi0man.github.io/axio_calcul/engineer/" />

	<title>amoca | Engineering Calculator</title>
</svelte:head>

<MathPageLayout nowMode="ENGINEER">
	{#snippet display()}
		<DisText />
	{/snippet}

	{#snippet btnDigit()}
		<BtnBlockDigit />
	{/snippet}

	{#snippet buttons()}
		<BtnBlockOpEngineer />
	{/snippet}

	{#snippet btnBaseOp()}
		<BtnBlockOp />
	{/snippet}

	{#snippet ads()}
		<AdvertisementGor setBanners="1" />
	{/snippet}
</MathPageLayout>

<!-- import BtnBlockOpBasic from '$lib/components/Btn/BtnBlockFeatures/BtnBlockOpBasic.svelte';
import AdvertisementLine2 from '$lib/components/advertisement/advertisementLine2.svelte';
'BASIC'; -->
