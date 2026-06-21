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
