<script>
	/**
	 * src/lib/components/advertisement/advertisementLine.svelte
	 * РАБОТАЕТ С ГРУППОЙ КАРТИНОК И ОДНОЙ ССЫЛКОЙ
	 * Компонент для рекламного объявления узкая полоса между блоками
	 * одна картинка исчезает и вторая падает сверху вниз
	 */
	import { onMount } from 'svelte';

	import src0 from '$lib/assets/banerLineH72/pazGor2.png';
	import src1 from '$lib/assets/banerLineH72/pazGor1.png';
	import src2 from '$lib/assets/banerLineH72/pazGor3.png';

	// Массив изображений
	const images = [src0, src1, src2];
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
		<img src={images[currentIndex]} alt="puzzle advertisement" class="slide-img" />
	{/key}
</a>

<style lang="scss">
	.catalog__item {
		display: block;
		width: 100%;
		height: 100%;
		position: relative;
		border: none;
		border-radius: 0;
	}

	.slide-img {
		border: none;
		border-radius: 0;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: cover; // Чтобы картинка заполняла всё пространство

		// Анимация появления сверху
		animation: slideInDown 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
	}

	@keyframes slideInDown {
		from {
			transform: translateY(-100%);
		}
		to {
			transform: translateY(0);
		}
	}
</style>
