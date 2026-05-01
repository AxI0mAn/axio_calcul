<script>
	/**
	 * Компонент для рекламного объявления узкая полоса между блоками
	 * одна картинка исчезает и вторая падает сверху вниз
	 * Интервал (JS): setInterval(..., 5000) — это частота смены. Он определяет, как часто срабатывает триггер на замену картинки. Если вы его не меняете, картинка будет "ждать" 5 секунд.
	 * Длительность (CSS/Transition): duration: 1000 — это скорость самого движения. Если поставить 300, картинка пролетит очень быстро, но следующая всё равно начнет движение только через 5 секунд.
	 */
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	import src0 from '$lib/assets/banerLineH72_15puzzle/15puzzle.png';
	import src1 from '$lib/assets/banerLineH72_15puzzle/15puzzle1.png';
	import src2 from '$lib/assets/banerLineH72_15puzzle/15puzzle2.png';
	import src3 from '$lib/assets/banerLineH72_15puzzle/15puzzle3.png';
	import src4 from '$lib/assets/banerLineH72_15puzzle/15puzzle4.png';

	// Массив изображений
	const images = [src0, src1, src2, src3, src4];
	let currentIndex = $state(0);

	onMount(() => {
		const interval = setInterval(() => {
			currentIndex = (currentIndex + 1) % images.length;
		}, 5000);

		return () => clearInterval(interval);
	});
</script>

<a href="https://axi0man.github.io/axI0_Puzzle/" target="_blank" class="catalog__items">
	{#key currentIndex}
		<div
			class="img-wrapper"
			in:fly={{ y: '-100%', duration: 1000 }}
			out:fly={{ y: '100%', duration: 1000 }}
		>
			<img src={images[currentIndex]} alt="puzzle" />
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
