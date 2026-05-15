<script>
	import MathPageLayout from '$lib/components/aPage/MathPageLayout.svelte';
	import BtnBlockOpFraction from '$lib/components/Btn/BtnBlockFeatures/BtnBlockOpFraction.svelte';
	import AdvertisementLine from '$lib/components/advertisement/advertisementLine.svelte';
</script>

<MathPageLayout nowMode="FRACTION">
	{#snippet buttons()}
		<BtnBlockOpFraction />
	{/snippet}

	{#snippet ads()}
		<AdvertisementLine />
	{/snippet}
</MathPageLayout>
