<script>
	import MathPageLayout from '$lib/components/aPage/MathPageLayout.svelte';
	import DisText from '$lib/components/Display/DisText.svelte';
	import BtnBlockOp from '$lib/components/Btn/BtnBlockBase/BtnBlockOp.svelte';
	import BtnBlockDigit from '$lib/components/Btn/BtnBlockBase/BtnBlockDigit.svelte';
	import BtnBlockOpEngineer from '$lib/components/Btn/BtnBlockFeatures/BtnBlockOpEngineer.svelte';
	import AdvertisementLine2 from '$lib/components/advertisement/advertisementLine2.svelte';
</script>

<MathPageLayout nowMode="ENGINEER">
	{#snippet display()}
		<DisText />
	{/snippet}

	{#snippet buttonsDigits()}
		<BtnBlockDigit />
	{/snippet}

	{#snippet buttonsFunc()}
		<BtnBlockOpEngineer />
	{/snippet}

	{#snippet buttonsBaseOp()}
		<BtnBlockOp />
	{/snippet}

	{#snippet ads()}
		<AdvertisementLine2 />
	{/snippet}
</MathPageLayout>

<!-- import BtnBlockOpBasic from '$lib/components/Btn/BtnBlockFeatures/BtnBlockOpBasic.svelte';
import AdvertisementLine2 from '$lib/components/advertisement/advertisementLine2.svelte';
'BASIC'; -->
