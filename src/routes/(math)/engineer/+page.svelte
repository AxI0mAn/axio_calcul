<script>
	// src/routes/(math)/engineer/+page.svelte
	import MathPageLayout from '$lib/components/aPage/MathPageLayout.svelte';
	import BtnBlockOpEngineer from '$lib/components/Btn/BtnBlockMath/BtnBlockOpEngineer.svelte';
	import AdvertisementLine2 from '$lib/components/advertisement/advertisementLine2.svelte';

	import BtnBlockDigit from '$lib/components/Btn/BtnBlockBase/BtnBlockDigit.svelte';
	import BtnBlockOp from '$lib/components/Btn/BtnBlockBase/BtnBlockOp.svelte';
	import DisText from '$lib/components/Display/DisMath/DisText.svelte';
</script>

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
		<AdvertisementLine2 />
	{/snippet}
</MathPageLayout>

<!-- import BtnBlockOpBasic from '$lib/components/Btn/BtnBlockFeatures/BtnBlockOpBasic.svelte';
import AdvertisementLine2 from '$lib/components/advertisement/advertisementLine2.svelte';
'BASIC'; -->
