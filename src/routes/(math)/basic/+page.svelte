<script>
	import MathPageLayout from '$lib/components/aPage/MathPageLayout.svelte';
	import BtnBlockOpBasic from '$lib/components/Btn/BtnBlockMath/BtnBlockOpBasic.svelte';
	import AdvertisementLine from '$lib/components/advertisement/advertisementLine.svelte';
</script>

<MathPageLayout nowMode="BASIC">
	{#snippet buttons()}
		<BtnBlockOpBasic />
	{/snippet}

	{#snippet ads()}
		<AdvertisementLine />
	{/snippet}
</MathPageLayout>
