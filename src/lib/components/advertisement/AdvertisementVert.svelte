<script>
	import Advertisement from '$lib/components/advertisement/advertisement.svelte';

	import srcJpeg0 from '$lib/assets/banerVert916/ascetxtVert.jpeg';
	import srcWebp0 from '$lib/assets/banerVert916/ascetxtVert.webp';
	import srcJpeg2 from '$lib/assets/banerVert916/pazVert3.jpeg';
	import srcWebp2 from '$lib/assets/banerVert916/pazVert3.webp';

	let { setBanners = '1' } = $props();

	const banersPageLeft = [
		{
			link: 'https://axi0man.github.io/ascetxt/',
			alt: 'txt note',
			src: {
				webp: srcWebp0,
				jpeg: srcJpeg0
			}
		},
		{
			link: 'https://axi0man.github.io/axI0_Puzzle/',
			alt: 'Puzzle banner',
			src: {
				webp: srcWebp2,
				jpeg: srcJpeg2
			}
		}
	];

	import srcJpegR1 from '$lib/assets/banerVert916/calcAllVert.jpeg';
	import srcWebpR1 from '$lib/assets/banerVert916/calcAllVert.webp';
	import srcJpegR2 from '$lib/assets/banerVert916/calcEnginVert.jpeg';
	import srcWebpR2 from '$lib/assets/banerVert916/calcEnginVert.webp';
	import srcJpegR3 from '$lib/assets/banerVert916/calcFractVert.jpeg';
	import srcWebpR3 from '$lib/assets/banerVert916/calcFractVert.webp';
	import srcJpegR4 from '$lib/assets/banerVert916/calcTrigVert.jpeg';
	import srcWebpR4 from '$lib/assets/banerVert916/calcTrigVert.webp';

	const banersPageRight = [
		{
			link: 'https://axi0man.github.io/axio_calcul/',
			alt: 'Calculator banner',
			src: {
				webp: srcJpegR1,
				jpeg: srcWebpR1
			}
		},
		{
			link: 'https://axi0man.github.io/axio_calcul/engineer/',
			alt: 'Calculator banner',
			src: {
				webp: srcJpegR2,
				jpeg: srcWebpR2
			}
		},
		{
			link: 'https://axi0man.github.io/axio_calcul/fraction/',
			alt: 'Calculator banner',
			src: {
				webp: srcJpegR3,
				jpeg: srcWebpR3
			}
		},
		{
			link: 'https://axi0man.github.io/axio_calcul/trigonometry/',
			alt: 'Calculator banner',
			src: {
				webp: srcJpegR4,
				jpeg: srcWebpR4
			}
		}
	];

	let bannerSet = $state();
	if (setBanners === '1') {
		bannerSet = banersPageLeft;
	} else {
		bannerSet = banersPageRight;
	}
</script>

<Advertisement
	baners={bannerSet}
	customClass="vertBaner"
	effect="EffectLeftRight"
	interval="7000"
/>
