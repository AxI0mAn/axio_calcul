<script>
	import MathPageLayout from '$lib/components/aPage/MathPageLayout.svelte';
	import CornerSwitchTrigon from '$lib/components/Btn/BtnBlockMath/CornerSwitchTrigon.svelte';
	import BtnBlockOpTrigon from '$lib/components/Btn/BtnBlockMath/BtnBlockOpTrigon.svelte';
	import AdvertisementLine2 from '$lib/components/advertisement/advertisementLine2.svelte';
</script>

<MathPageLayout nowMode="TRIGONOMETRY">
	{#snippet buttons()}
		<CornerSwitchTrigon />
		<BtnBlockOpTrigon />
	{/snippet}

	{#snippet ads()}
		<AdvertisementLine2 />
	{/snippet}
</MathPageLayout>
