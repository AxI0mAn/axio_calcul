<script>
	// src/routes/(math)/fraction/+page.svelte
	import MathPageLayout from '$lib/components/aPage/MathPageLayout.svelte';
	import AdvertisementLine2 from '$lib/components/advertisement/advertisementLine2.svelte';

	import DisFraction from '$lib/components/Display/DisFraction/DisFraction.svelte';
	import BtnBlockDigitFraction from '$lib/components/Btn/BtnBlockMath/BtnBlockFraction/BtnBlockDigitFraction.svelte';
	import BtnBlockOpFraction from '$lib/components/Btn/BtnBlockMath/BtnBlockFraction/BtnBlockOpFraction.svelte';
	import BtnBlockBaseFraction from '$lib/components/Btn/BtnBlockMath/BtnBlockFraction/BtnBlockBaseFraction.svelte';
</script>

<svelte:head>
	<meta
		name="description"
		content="This calculator lets you build complete mathematical expressions directly from the keypad, just like using a standard calculator."
	/>

	<meta property="og:title" content="amoca - Fast Online Fraction Calculator." />
	<meta
		property="og:description"
		content="This calculator lets you build complete mathematical expressions directly from the keypad, just like using a standard calculator."
	/>

	<meta name="twitter:title" content="amoca - Fast Online Fraction Calculator." />
	<meta
		name="twitter:description"
		content="This calculator lets you build complete mathematical expressions directly from the keypad, just like using a standard calculator."
	/>

	<meta name="twitter:image" content="https://axi0man.github.io/axio_calcul/ogImage/og_frac.png" />
	<link rel="canonical" href="https://axi0man.github.io/axio_calcul/fraction/" />
	<meta property="og:url" content="https://axi0man.github.io/axio_calcul/fraction/" />

	<title>amoca | Fraction Calculator</title>
</svelte:head>

<MathPageLayout nowMode="FRACTION">
	{#snippet display()}
		<DisFraction />
	{/snippet}

	{#snippet btnDigit()}
		<BtnBlockDigitFraction />
	{/snippet}

	{#snippet buttons()}
		<BtnBlockOpFraction />
	{/snippet}

	{#snippet btnBaseOp()}
		<BtnBlockBaseFraction />
	{/snippet}

	{#snippet ads()}
		<AdvertisementLine2 />
	{/snippet}
</MathPageLayout>
