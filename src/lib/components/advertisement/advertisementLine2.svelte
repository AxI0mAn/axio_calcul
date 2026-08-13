<script>
	/**
	 * src/lib/components/advertisement/advertisementLine2.svelte
	 * Компонент для рекламного объявления узкая полоса между блоками
	 * одна картинка исчезает и вторая падает сверху вниз
	 * РАБОТАЕТ С РАЗНЫМИ ССЫЛКАМИ
	 * Интервал (JS): setInterval(..., 5000) — это частота смены. Он определяет, как часто срабатывает триггер на замену картинки. Если вы его не меняете, картинка будет "ждать" 5 секунд.
	 * Длительность (CSS/Transition): duration: 1000 — это скорость самого движения. Если поставить 300, картинка пролетит очень быстро, но следующая всё равно начнет движение только через 5 секунд.
	 */

	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	import src0 from '$lib/assets/banerLineH72/pazGor2.jpeg';
	import src1 from '$lib/assets/banerLineH72/citrusGor.jpeg';
	import src2 from '$lib/assets/banerLineH72/pazGor1.jpeg';
	import src3 from '$lib/assets/banerLineH72/ascetxtGor.jpeg';
	import src4 from '$lib/assets/banerLineH72/pazGor3.jpeg';

	// Массив баннеров с картинками и индивидуальными ссылками
	const baners = [
		{
			img: src0,
			link: 'https://axi0man.github.io/axI0_Puzzle/'
		},
		{
			img: src1,
			link: 'https://axi0man.github.io/axiopage/2citrus/index.html'
		},
		{
			img: src2,
			link: 'https://axi0man.github.io/axI0_Puzzle/'
		},
		{
			img: src3,
			link: 'https://axi0man.github.io/ascetxt/'
		},
		{
			img: src4,
			link: 'https://axi0man.github.io/axI0_Puzzle/'
		}
	];

	let currentIndex = $state(0);

	onMount(() => {
		const interval = setInterval(() => {
			currentIndex = (currentIndex + 1) % baners.length;
		}, 7000);

		return () => clearInterval(interval);
	});
</script>

<!-- Ссылка теперь берется динамически из текущего объекта массива -->
<a href={baners[currentIndex].link} target="_blank" class="catalog__items">
	{#key currentIndex}
		<div
			class="img-wrapper"
			in:fly={{ y: '-100%', duration: 1000 }}
			out:fly={{ y: '100%', duration: 1000 }}
		>
			<!-- Картинка также берется из текущего объекта -->
			<img src={baners[currentIndex].img} alt="banner" />
		</div>
	{/key}
</a>

<style lang="scss">
	.catalog__items {
		display: block;
		width: 100%;
		height: 100%;
	}

	.img-wrapper {
		position: absolute; // Чтобы обе картинки находились в одном месте при анимации
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
