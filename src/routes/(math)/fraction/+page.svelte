<script>
	// src/routes/(math)/fraction/+page.svelte
	import MathPageLayout from '$lib/components/aPage/MathPageLayout.svelte';
	import AdvertisementLine2 from '$lib/components/advertisement/advertisementLine2.svelte';

	import DisFraction from '$lib/components/Display/DisFraction/DisFraction.svelte';
	import BtnBlockDigitFraction from '$lib/components/Btn/BtnBlockMath/BtnBlockFraction/BtnBlockDigitFraction.svelte';
	import BtnBlockOpFraction from '$lib/components/Btn/BtnBlockMath/BtnBlockFraction/BtnBlockOpFraction.svelte';
	import BtnBlockBaseFraction from '$lib/components/Btn/BtnBlockMath/BtnBlockFraction/BtnBlockBaseFraction.svelte';
</script>

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
