<script>
	/**
	 * Универсальный компонент слайдера баннеров с анимациями
	 *
	 * @param {Array} baners - массив объектов баннеров
	 * @param {string} baners[].link - URL ссылки
	 * @param {Object} baners[].src - объект с путями к изображениям
	 * @param {string} baners[].src.webp - путь к WebP версии
	 * @param {string} baners[].src.jpeg - путь к JPEG версии
	 * @param {string} baners[].alt - альтернативный текст
	 * @param {string} baners[].width - ширина изображения
	 * @param {string} baners[].height - высота изображения
	 * @param {string} [width='100%'] - ширина контейнера слайдера
	 * @param {string} [height='auto'] - высота контейнера слайдера
	 * @param {string} [interval = "7000"] - интервал смены слайда
	 * @param {string} [customClass=''] - gorBaner || vertBaner
	 * @param {string} [effect=''] - EffectTopDown || EffectLeftRight || EffectOpacity
	 * @param {boolean} [hasShadow=false] - эффект мерцающей тени
	 */
	import { onMount } from 'svelte';
	import { fly, fade } from 'svelte/transition';

	// Пропсы компонента
	let {
		baners = [],
		width = '100%',
		height = 'auto',
		customClass = '',
		effect = '',
		hasShadow = false,
		interval = '10000'
	} = $props();

	// Состояния
	let currentIndex = $state(0);
	let step = $state(0);

	// Реактивные вычисления
	let currentBanner = $derived(baners[currentIndex] || null);
	let hasBanners = $derived(baners.length > 0);
	let isSingleBanner = $derived(baners.length === 1);

	// Автоматическое переключение
	onMount(() => {
		if (!hasBanners || isSingleBanner) return;

		const timer = setInterval(() => {
			currentIndex = (currentIndex + 1) % baners.length;
			step += 1;
		}, +interval); // <-- ИСПОЛЬЗУЕТСЯ ЗНАЧЕНИЕ ИЗ ПРОПСОВ

		return () => clearInterval(timer);
	});

	// Обработчик ошибки загрузки изображения
	function handleImageError(event) {
		const img = event.target;
		if (img instanceof HTMLImageElement) {
			img.style.display = 'none';
			console.warn('⚠️ Banner image failed to load:', img.src);
		}
	}
</script>

{#if hasBanners}
	<a
		href={currentBanner?.link || '#'}
		target="_blank"
		rel="noopener noreferrer"
		class="banner-slider {customClass} {hasShadow ? 'effect-shadow' : ''}"
		style="width: {width}; height: {height};"
		aria-label={currentBanner?.alt || 'Banner slider'}
	>
		<div class="img-wrapper">
			<!-- Выходящий блок (предыдущий баннер) -->
			<div
				class="anim-box"
				out:fly={{
					y: effect === 'EffectTopDown' ? '100%' : 0,
					x: effect === 'EffectLeftRight' ? '100%' : 0,
					duration: 1000
				}}
			>
				<picture>
					<source
						srcset={baners[(currentIndex - 1 + baners.length) % baners.length]?.src?.webp}
						type="image/webp"
					/>
					<img
						src={baners[(currentIndex - 1 + baners.length) % baners.length]?.src?.jpeg}
						alt={baners[(currentIndex - 1 + baners.length) % baners.length]?.alt || 'banner'}
						loading="lazy"
						decoding="async"
						width={baners[(currentIndex - 1 + baners.length) % baners.length]?.width}
						height={baners[(currentIndex - 1 + baners.length) % baners.length]?.height}
						onerror={handleImageError}
					/>
				</picture>
			</div>

			<!-- Входящий блок (текущий баннер) -->
			{#key step}
				<div
					class="anim-box"
					in:fly={{
						y: effect === 'EffectTopDown' ? '-100%' : 0,
						x: effect === 'EffectLeftRight' ? '-100%' : 0,
						duration: 1000
					}}
				>
					<picture>
						<source srcset={currentBanner?.src?.webp} type="image/webp" />
						<img
							src={currentBanner?.src?.jpeg}
							alt={currentBanner?.alt || 'banner'}
							loading="lazy"
							decoding="async"
							width={currentBanner?.width}
							height={currentBanner?.height}
							onerror={handleImageError}
						/>
					</picture>
				</div>
			{/key}
		</div>
	</a>
{/if}

<style lang="scss">
	.banner-slider {
		display: block;
		position: relative;
		overflow: hidden;
		text-decoration: none;
		background: transparent;
	}

	/* Пропорции внешнего элемента */
	.banner-slider.gorBaner {
		width: 100%;
		min-height: 72px;
		height: fit-content;
		aspect-ratio: 6/1;
	}

	.banner-slider.vertBaner {
		min-height: 50vh;
		height: fit-content;
		aspect-ratio: 9/16;
	}

	.img-wrapper {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.anim-box {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* Статичный режим (один баннер) */
	.anim-box.static {
		position: relative;
	}

	picture,
	img {
		width: 100%;
		height: auto;
		object-fit: scale-down; // чтоб картинка целиком помещалась в контейнер
		display: block;
	}

	/* Эффект мерцающей тени */
	.effect-shadow {
		animation: shadowPulse 3s infinite ease-in-out;
	}

	@keyframes shadowPulse {
		0%,
		100% {
			box-shadow: 0 0 10px rgba(0, 255, 128, 0.4);
		}
		50% {
			box-shadow:
				0 0 25px rgba(0, 255, 128, 0.8),
				inset 0 0 10px rgba(0, 255, 128, 0.2);
		}
	}
</style>
