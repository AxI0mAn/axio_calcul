<script>
	import MathPageLayout from '$lib/components/aPage/MathPageLayout.svelte';
	import FractionDisplay from '$lib/components/Display/DisFraction/FractionDisplay.svelte';
	import BtnBlockDigitFraction from '$lib/components/Btn/BtnBlockBase/BtnBlockDigitFraction.svelte';
	import BtnBlockOpFraction from '$lib/components/Btn/BtnBlockFeatures/BtnBlockOpFraction.svelte';
	import BtnBlockOpBaseFraction from '$lib/components/Btn/BtnBlockBase/BtnBlockOpBaseFraction.svelte';
	import AdvertisementLine from '$lib/components/advertisement/advertisementLine.svelte';
</script>

<MathPageLayout nowMode="FRACTION">
	{#snippet display()}
		<FractionDisplay />
	{/snippet}

	{#snippet buttonsDigits()}
		<BtnBlockDigitFraction />
	{/snippet}

	{#snippet buttonsFunc()}
		<BtnBlockOpFraction />
	{/snippet}

	{#snippet buttonsBaseOp()}
		<BtnBlockOpBaseFraction />
	{/snippet}

	{#snippet ads()}
		<AdvertisementLine />
	{/snippet}
</MathPageLayout>
