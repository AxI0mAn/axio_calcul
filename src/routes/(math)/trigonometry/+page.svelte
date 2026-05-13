<script>
	import MathPageLayout from '$lib/components/aPage/MathPageLayout.svelte';
	import CornerSwitch from '$lib/components/Btn/BtnBlockFeatures/CornerSwitch.svelte';
	import BtnBlockOpTrigon from '$lib/components/Btn/BtnBlockFeatures/BtnBlockOpTrigon.svelte';
	import AdvertisementLine2 from '$lib/components/advertisement/advertisementLine2.svelte';
</script>

<MathPageLayout nowMode="TRIGONOMETRY">
	{#snippet buttons()}
		<CornerSwitch />
		<BtnBlockOpTrigon />
	{/snippet}

	{#snippet ads()}
		<AdvertisementLine2 />
	{/snippet}
</MathPageLayout>
