<script>
	// src/routes/(math)/basic/+page.svelte
	import MathPageLayout from '$lib/components/aPage/MathPageLayout.svelte';
	import BtnBlockOpBasic from '$lib/components/Btn/BtnBlockMath/BtnBlockOpBasic.svelte';
	import AdvertisementLine from '$lib/components/advertisement/advertisementLine.svelte';

	import BtnBlockDigit from '$lib/components/Btn/BtnBlockBase/BtnBlockDigit.svelte';
	import BtnBlockOp from '$lib/components/Btn/BtnBlockBase/BtnBlockOp.svelte';
	import DisText from '$lib/components/Display/DisMath/DisText.svelte';
</script>

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
		<AdvertisementLine />
	{/snippet}
</MathPageLayout>
