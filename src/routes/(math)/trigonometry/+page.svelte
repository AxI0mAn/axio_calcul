<script>
	import MathPageLayout from '$lib/components/aPage/MathPageLayout.svelte';
	import DisText from '$lib/components/Display/DisText.svelte';
	import BtnBlockDigit from '$lib/components/Btn/BtnBlockBase/BtnBlockDigit.svelte';
	import CornerSwitch from '$lib/components/Btn/BtnBlockFeatures/CornerSwitch.svelte';
	import BtnBlockOpTrigon from '$lib/components/Btn/BtnBlockFeatures/BtnBlockOpTrigon.svelte';
	import BtnBlockOp from '$lib/components/Btn/BtnBlockBase/BtnBlockOp.svelte';
	import AdvertisementLine2 from '$lib/components/advertisement/advertisementLine2.svelte';
</script>

<MathPageLayout nowMode="TRIGONOMETRY">
	{#snippet display()}
		<DisText />
	{/snippet}

	{#snippet buttonsDigits()}
		<BtnBlockDigit />
	{/snippet}

	{#snippet buttonsFunc()}
		<CornerSwitch />
		<BtnBlockOpTrigon />
	{/snippet}

	{#snippet buttonsBaseOp()}
		<BtnBlockOp />
	{/snippet}

	{#snippet ads()}
		<AdvertisementLine2 />
	{/snippet}
</MathPageLayout>
