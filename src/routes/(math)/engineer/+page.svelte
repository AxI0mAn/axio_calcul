<script>
	import MathPageLayout from '$lib/components/aPage/MathPageLayout.svelte';
	import BtnBlockOpEngineer from '$lib/components/Btn/BtnBlockMath/BtnBlockOpEngineer.svelte';
	import AdvertisementLine2 from '$lib/components/advertisement/advertisementLine2.svelte';
</script>

<MathPageLayout nowMode="ENGINEER">
	{#snippet buttons()}
		<BtnBlockOpEngineer />
	{/snippet}

	{#snippet ads()}
		<AdvertisementLine2 />
	{/snippet}
</MathPageLayout>

<!-- import BtnBlockOpBasic from '$lib/components/Btn/BtnBlockFeatures/BtnBlockOpBasic.svelte';
import AdvertisementLine2 from '$lib/components/advertisement/advertisementLine2.svelte';
'BASIC'; -->
