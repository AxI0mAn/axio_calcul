<script>
	import MathPageLayout from '$lib/components/aPage/MathPageLayout.svelte';
	import DisText from '$lib/components/Display/DisText.svelte';
	import BtnBlockOp from '$lib/components/Btn/BtnBlockBase/BtnBlockOp.svelte';
	import BtnBlockDigit from '$lib/components/Btn/BtnBlockBase/BtnBlockDigit.svelte';
	import BtnBlockOpBasic from '$lib/components/Btn/BtnBlockFeatures/BtnBlockOpBasic.svelte';
	import AdvertisementLine from '$lib/components/advertisement/advertisementLine.svelte';
</script>

<MathPageLayout nowMode="BASIC">
	{#snippet display()}
		<DisText />
	{/snippet}

	{#snippet buttonsDigits()}
		<BtnBlockDigit />
	{/snippet}

	{#snippet buttonsFunc()}
		<BtnBlockOpBasic />
	{/snippet}

	{#snippet buttonsBaseOp()}
		<BtnBlockOp />
	{/snippet}

	{#snippet ads()}
		<AdvertisementLine />
	{/snippet}
</MathPageLayout>
