<script>
	import Advertisement from './advertisement.svelte';

	let { setBanners = '1' } = $props();
	// -------------- рекламные горизонтальные банеры для не десктоп уже 1023

	import src01jpeg from '$lib/assets/banerLineH72/pazGor1.jpeg';
	import src01webp from '$lib/assets/banerLineH72/pazGor1.webp';
	import src02jpeg from '$lib/assets/banerLineH72/pazGor2.jpeg';
	import src02webp from '$lib/assets/banerLineH72/pazGor2.webp';
	import src03jpeg from '$lib/assets/banerLineH72/pazGor3.jpeg';
	import src03webp from '$lib/assets/banerLineH72/pazGor3.webp';

	const banersGor1 = [
		{
			link: 'https://axi0man.github.io/axI0_Puzzle/',
			alt: 'Puzzle banner',
			src: {
				webp: src01webp,
				jpeg: src01jpeg
			}
		},
		{
			link: 'https://axi0man.github.io/axI0_Puzzle/',
			alt: 'Puzzle banner',
			src: {
				webp: src02webp,
				jpeg: src02jpeg
			}
		},
		{
			link: 'https://axi0man.github.io/axI0_Puzzle/',
			alt: 'Puzzle banner',
			src: {
				webp: src03webp,
				jpeg: src03jpeg
			}
		}
	];

	import src04jpeg from '$lib/assets/banerLineH72/ascetxtGor.jpeg';
	import src04webp from '$lib/assets/banerLineH72/ascetxtGor.webp';
	import src05jpeg from '$lib/assets/banerLineH72/citrusGor.jpeg';
	import src05webp from '$lib/assets/banerLineH72/citrusGor.webp';

	const banersGor2 = [
		{
			link: 'https://axi0man.github.io/ascetxt/',
			alt: 'txt banner',
			src: {
				webp: src04webp,
				jpeg: src04jpeg
			}
		},
		{
			link: 'https://axi0man.github.io/axiopage/2citrus/index.html',
			alt: 'citrus banner',
			src: {
				webp: src05webp,
				jpeg: src05jpeg
			}
		}
	];

	let bannerSet = $state();
	if (setBanners === '1') {
		bannerSet = banersGor1;
	} else {
		bannerSet = banersGor2;
	}
</script>

<Advertisement baners={bannerSet} customClass="gorBaner" effect="EffectOpacity" interval="7000" />
