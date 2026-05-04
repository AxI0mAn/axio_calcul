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
-->
<script>
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

	let props = $props();

	let isLoaded = $state(false);

	function handleLoad() {
		isLoaded = true;
	}
</script>

<div
	class="picture-wrapper {props.className}"
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
		/>
	</picture>

	{#if !isLoaded}
		<div class="loader-placeholder" aria-hidden="true"></div>
	{/if}
</div>

<style>
	.picture-wrapper {
		position: relative;
		display: block; /* Изменено с inline-block для лучшего контроля размеров */
		overflow: hidden;
		background-color: #f3f4f6;
		border-radius: 8px;
		width: 100%;
	}

	.fade-img {
		opacity: 0;
		transition: opacity 0.5s ease-in-out;
		display: block;
		width: 100%;
		height: auto; /* Работает правильно в паре с аспектом родителя */
		object-fit: cover;
	}

	.loaded .fade-img {
		opacity: 1;
	}

	.loader-placeholder {
		position: absolute;
		inset: 0;
		background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
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
