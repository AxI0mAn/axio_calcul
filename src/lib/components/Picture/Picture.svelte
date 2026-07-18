<!--    Применение
   <script>
			import Picture from './Picture.svelte';
		</script>

<Picture 
  src={{ 
    webp: "/images/calc-bg.webp", 
    jpeg: "/images/calc-bg.jpg" 
  }}  
  alt="Фон инженерного калькулятора"
  class="bg-image" 
  loading="lazy"
  decoding="async"
  width={1920}  - только пиксели
  height={1080} - только пиксели
/>

		/* Для LCP (фоны в шапке, герои страниц): Всегда используйте decoding="sync" в сочетании с loading="eager". */
		/* Для потоковых иллюстраций - применяем decoding = 'async' с ленивой загрузкой loading = 'lazy'*/

		decoding="sync" (Синхронное декодирование)
		Браузер декодирует картинку в основном потоке (Main Thread) прямо во время парсинга страницы. Пока он не дорисовал картинку, весь остальной интерфейс «ждёт».
		Может вызвать микрофризы анимаций или нажатий кнопок.
		Страница ждёт, пока картинка обработается.
		Используется для критически важных элементов в самом верху страницы (например, логотип).

		decoding="async" (Асинхронное декодирование)
		Браузер уносит задачу по декодированию картинки в фоновый поток. Основной поток остаётся свободным, и интерфейс продолжает плавно работать (не фризит).
		Сохраняет интерфейс идеально плавным.
		Страница рендерится сразу, картинка «всплывёт» чуть позже.
		Используется для тяжелых картинок, каталогов, галерей и иконок.

		Для современных веб-приложений decoding="async" является стандартом по умолчанию для 95% изображений.
-->
<script>
	/**
	 * src/lib/components/Picture/Picture.svelte
	 * компонент интеграции картинок.
	 * или webp или jpeg
	 * оптимизация в виде ленивой загрузки и
	 */
	/**
	 * @typedef {Object} Props
	 * @property {{webp?: string, jpeg: string}} src
	 * @property {string} [alt]
	 * @property {import('svelte/elements').HTMLImgAttributes['loading']} [loading]
	 * @property {import('svelte/elements').HTMLImgAttributes['decoding']} [decoding]
	 * @property {string} [class]
	 * @property {number} [width]
	 * @property {number} [height]
	 */

	import { appStore } from '$lib/store/appStore.svelte.js'; // Импортируем твой стор

	/**
	 * @typedef {Object} Props
	 * @property {{webp?: string, jpeg: string}} src
	 * @property {string} [alt]
	 * @property {import('svelte/elements').HTMLImgAttributes['loading']} [loading]
	 * @property {import('svelte/elements').HTMLImgAttributes['decoding']} [decoding]
	 * @property {string} [class] - В Svelte 5 лучше использовать явное имя props.class или деструктуризацию
	 * @property {number} [width]
	 * @property {number} [height]
	 */

	let props = $props();

	let isLoaded = $state(false);

	// Вычисляем, активна ли светлая тема прямо сейчас
	let isLightTheme = $derived(appStore.theme === 'light');

	function handleLoad() {
		isLoaded = true;
	}
</script>

<div
	class="picture-wrapper {props.class || ''}"
	style:aspect-ratio={props.width && props.height ? `${props.width}/${props.height}` : 'auto'}
>
	<picture class:loaded={isLoaded}>
		{#if props.src.webp}
			<source srcset={props.src.webp} type="image/webp" />
		{/if}

		<img
			src={props.src.jpeg}
			alt={props.alt || ''}
			loading={props.loading}
			decoding={props.decoding}
			width={props.width}
			height={props.height}
			{...props.rest}
			onload={handleLoad}
			class="fade-img"
			class:inverted={isLightTheme}
		/>
	</picture>

	{#if !isLoaded}
		<div class="loader-placeholder" aria-hidden="true"></div>
	{/if}
</div>

<style lang="scss">
	.picture-wrapper {
		position: relative;
		display: block;
		overflow: hidden;
		background-color: transparent;
		border-radius: 8px;
		width: 100%;
	}

	.fade-img {
		opacity: 0;
		transition:
			opacity 0.5s ease-in-out,
			filter 0.3s ease; /* Добавили плавный переход для фильтра */
		display: block;
		width: 100%;
		height: auto;
		object-fit: cover;

		// Класс-модификатор для превращения темной картинки в негатив
		&.inverted {
			// Инвертирует цвета, но делает картинку мягче чем filter: invert(1);, чтобы она аккуратно сидела на светлой кнопке
			filter: invert(1) brightness(0.95) contrast(0.9);
		}
	}

	.loaded .fade-img {
		opacity: 1;
	}

	.loader-placeholder {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			90deg,
			rgba($clr-bg-darker-rgb, 0.9) 25%,
			rgba($clr-mint-rgb, 0.2) 50%,
			rgba($clr-bg-darker-rgb, 0.9) 75%
		);
		background-size: 200% 100%;
		animation: skeleton-loading 1.5s infinite;
		z-index: 1;
	}

	@keyframes skeleton-loading {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}
</style>
