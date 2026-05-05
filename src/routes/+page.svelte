<script>
	/**
	 * домашняя страница src/routes/+page.svelte
	 */

	// ------------- ссылки с учётом локализации в будущем
	// @ts-ignore
	import { base } from '$app/paths';

	//
	import { onMount } from 'svelte';
	import { initAccordion } from '$lib/utils/initAccordion';

	onMount(() => {
		// Код внутри onMount никогда не запустится на сервере
		initAccordion();
	});

	// Double Tap Issue - перехватывает первый клик на мобильном устройстве
	import { initTouchHover } from '$lib/utils/initTouchCards';
	$effect(() => {
		initTouchHover('.catalog__card');
	});

	// ------------- логотипы для ссылок на страницы калькуляторов

	import Picture from '$lib/components/Picture/Picture.svelte';

	import srcExample_jpeg from '$lib/assets/iconPng/512/png_catalog.jpeg';
	import srcExample_webp from '$lib/assets/iconPng/512/png_catalog.webp';

	import srcBasic_jpeg from '$lib/assets/iconPng/512/png_math_basic.jpeg';
	import srcBasic_webp from '$lib/assets/iconPng/512/png_math_basic.webp';
	import srcEngineer_jpeg from '$lib/assets/iconPng/512/png_math_engineer.jpeg';
	import srcEngineer_webp from '$lib/assets/iconPng/512/png_math_engineer.webp';
	import srcTrigonom_jpeg from '$lib/assets/iconPng/512/png_math_trigonometry.jpeg';
	import srcTrigonom_webp from '$lib/assets/iconPng/512/png_math_trigonometry.webp';
</script>

<div class="app-wrapper">
	<aside class="field_left"></aside>
	<main class="field_calculator catalog">
		<header class="home__header">
			<nav>BURGER</nav>
			<p class="appNameInHeader font-digits">axio mobile calculator</p>
			<a href="{base}/settings">Settings</a>
		</header>
		<h1 class="slogan">28 function in 2 calculators</h1>
		<div class="groupCalcAll">
			<details class="groupCalc" name="my-accordion">
				<summary>
					<h2 class="groupCalc__title">mathematics calculators</h2>
				</summary>
				<section class="group__catalog">
					<div class="catalog__post">
						<a href="{base}/basic" class="catalog__card">
							<Picture
								src={{
									webp: `${srcBasic_webp}`,
									jpeg: `${srcBasic_jpeg}`
								}}
								alt="Фон арифметического калькулятора"
								class="catalog__card--content"
								loading="eager"
								decoding="sync"
								//- только пиксели
								// width={512}
								// height={512}
							/>
							<h3 class="catalog__card--title"><span>basic</span></h3>
						</a>
					</div>
					<div class="catalog__post">
						<a href="{base}/engineer" class="catalog__card">
							<Picture
								src={{
									webp: `${srcEngineer_jpeg}`,
									jpeg: `${srcEngineer_webp}`
								}}
								alt="Фон инженерного калькулятора"
								class="catalog__card--content"
								loading="eager"
								decoding="sync"
								//- только пиксели
								// width={512}
								// height={512}
							/>
							<h3 class="catalog__card--title"><span>engineer</span></h3>
						</a>
					</div>
					<div class="catalog__post">
						<a href="{base}/trigonometry" class="catalog__card">
							<Picture
								src={{
									webp: `${srcTrigonom_jpeg}`,
									jpeg: `${srcTrigonom_webp}`
								}}
								alt="Фон тригонометрического калькулятора"
								class="catalog__card--content"
								loading="eager"
								decoding="sync"
								//- только пиксели
								// width={512}
								// height={512}
							/>
							<h3 class="catalog__card--title"><span>trigonometry</span></h3>
						</a>
					</div>
				</section>
			</details>
			<details class="groupCalc" name="my-accordion">
				<summary>
					<h2 class="groupCalc__title">geometry calculators</h2>
				</summary>
				<section class="group__catalog">
					<div class="catalog__post">
						<a href="{base}/basic" class="catalog__card">
							<Picture
								src={{
									webp: `${srcExample_webp}`,
									jpeg: `${srcExample_jpeg}`
								}}
								alt="Фон арифметического калькулятора"
								class="catalog__card--content"
								loading="eager"
								decoding="sync"
								//- только пиксели
								// width={512}
								// height={512}
							/>
							<h3 class="catalog__card--title"><span>example</span></h3>
						</a>
					</div>
				</section>
			</details>
		</div>
	</main>
	<article class="instruction" id="instruction">
		<!-- текстовые блоки  и иллюстрации -->
		<p>
			Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aliquid aliquam, nobis perferendis
			ipsum delectus corporis ad quos atque beatae quae nisi rerum id facere. Architecto molestias
			eos reprehenderit magni nam.
		</p>
	</article>
	<section class="reviews__old">
		<p>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui libero harum incidunt saepe
			eaque totam dicta eum nam omnis! Perferendis commodi magni deserunt officiis nisi sapiente
			itaque corrupti ab ipsum?
		</p>
		<!-- текстовые блоки ОТДЕЛЬНОЙ СТРАНИЦЕЙ   ????-->
	</section>
	<aside class="field_right">
		<!-- advertisement картинки и банеры -->
	</aside>
</div>

<style lang="scss">
	.field_calculator.catalog {
		width: 100%;
		// background: #1e293b;
		padding: 0.4rem;
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);

		display: flex;
		flex-flow: column nowrap;
		justify-content: space-between;
		align-items: center;
		gap: 24px;
	}

	.home__header {
		background-color: coral;
		width: 100%;
		padding: 24px 12px;
		display: flex;
		flex-flow: row nowrap;
		justify-content: space-between;
		align-items: center;
		.appNameInHeader {
			font-size: 1.5rem;
			font-weight: 777;
		}
	}
	.slogan {
		color: coral;
	}
	// =============================================================
	.groupCalcAll {
		display: flex;
		flex-flow: column nowrap;
		justify-content: flex-start;
		align-items: center;
		flex: 1;
	}
	.groupCalc {
		display: flex;
		flex-flow: column nowrap;
		justify-content: flex-start;
		align-items: center;
		gap: 1.618rem;
		margin-bottom: 3.236rem;
	}
	/* Убираем стандартный маркер у details*/
	/* Для Chrome, Edge, Safari и Opera */
	details summary::-webkit-details-marker {
		display: none;
	}

	/* Для Firefox и стандартное свойство */
	details summary {
		list-style: none;
	}

	/* На случай, если summary ведет себя как flex/grid (в Safari) */
	details summary::marker {
		display: none;
		content: '';
	}

	.group__catalog {
		/*  Catalog: 
  1. все карточки одинакового размера. 
  2. вёрстка - Flex-box
  3. наполняемость каталога - вручную 
  4. объем контента - фиксированный
  */
		margin: 0 auto;
		width: 96%;
		overflow: hidden;

		display: flex;
		flex-flow: row wrap;
		justify-content: space-evenly;
		row-gap: 1rem;
		column-gap: clamp(0.5rem, 0.8929rem + 1.7857vw, 2.5rem);
		/* column-gap: от 8 до 40рх - отступ между колонками */

		padding: 1rem;

		background: rgba(2, 17, 85, 0.1);
		box-shadow:
			0px 0px 30px rgb(var(--mainColorR), 0.4),
			inset 4px 4px 8px 4px rgba(1, 217, 195, 0.33),
			inset -4px -4px 8px 4px rgba(1, 217, 195, 0.33);
	}

	.catalog__post {
		// min-width: 280px;
		width: 40%; //440px;
		height: fit-content;
		margin: 0px;
		padding: 0px;
	}

	.catalog__card {
		height: fit-content;

		position: relative;
		padding: 0px;

		border-radius: 12px;

		box-shadow: 2px 2px 2px 2px rgb(var(--shadow));

		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr;

		transition: all 0.35s;

		-webkit-tap-highlight-color: transparent; /* Убирает синий квадрат при нажатии в Safari */
		-webkit-touch-callout: none; /* Убирает системное меню при долгом нажатии */
		user-select: none; /* Предотвращает выделение текста внутри */
		touch-action: manipulation; /* Оптимизирует задержку клика */
	}

	.catalog__card--content {
		grid-column: 1/2;
		grid-row: 1/2;
		place-self: center;

		display: block;
		max-width: 100%;
		height: auto;
		object-fit: fill;

		border-radius: 12px;
	}
	.groupCalc__title,
	.catalog__card--title {
		width: 100%;
		min-height: 2rem;
		padding: auto;
		position: absolute;
		grid-column: 1/2;
		grid-row: 1/2;
		place-self: center;

		display: flex;
		justify-content: center;
		align-items: center;

		font-size: 1.2rem;
		font-weight: 800;
		color: #86edf2;
		text-align: center;

		backdrop-filter: blur(10px);
		background: rgba(2, 17, 85, 0.3);
		box-shadow:
			0px 0px 30px rgb(var(--mainColorR), 0.4),
			inset 4px 4px 8px 4px rgba(1, 217, 195, 0.33),
			inset -4px -4px 8px 4px rgba(1, 217, 195, 0.33);

		border-top: 1px solid rgb(var(--mainColorR), 0.2);
		border-bottom: 1px solid rgb(var(--mainColorR), 0.2);
		transition: all 0.35s;
	}

	.groupCalc__title {
		width: 90%;
		font-size: 1.5rem;
		cursor: pointer;
	}

	.catalog__card--title {
		transform: scale(0.01);
	}

	/* Состояние Hover для устройств с мышью */
	@media (hover: hover) {
		.catalog__card:hover {
			box-shadow: -4px 4px 2px 2px rgba(255, 127, 80, 0.5); //rgb(var(--shadow), 0.9);
			outline: 4px solid coral;

			transition: box-shadow 0.05s;
			transition: all 0.5s;

			transform: rotate3d(1, 1, 0, 20deg);
			transform-style: preserve-3d;
		}

		.catalog__card:hover .catalog__card--title {
			box-shadow: 0px 0px 30px rgb(var(--mainColorL), 0.9);
			border-top: 1px solid rgb(var(--mainColorL), 0.2);
			border-bottom: 1px solid rgb(var(--mainColorL), 0.2);
			color: coral; //rgb(var(--shadow), 1);
			min-width: 100%;
			width: fit-content;
			min-height: 4rem;
			font-size: 2rem;

			padding: 2px 4px;
			text-shadow: -2px 2px 2px rgb(var(--mainColorL), 0.9);

			transition: all 0.35s;

			transform: translateZ(50px) scale(1);
		}

		.catalog__card:hover::before {
			position: absolute;
			bottom: -2px;
			content: '';
			background: transparent;
			width: 0%;
			height: 0px;
			transition: all 0.5s;
		}
	}

	.catalog__card:active:not(.is-hovered) {
		box-shadow: -4px 4px 2px 2px rgb(var(--shadow), 0.3);
		outline: none;
		box-shadow: none;
		text-decoration: none;

		transition: all 0.1s;
		transform: rotate3d(0, 0, 0, 20deg);
		transform-style: preserve-3d;
	}

	.catalog__card:active:not(.is-hovered) .catalog__card--title {
		backdrop-filter: blur(0px);
		box-shadow: none;
		border-top: none;
		border-bottom: none;
		color: rgb(var(--mainColorL), 0.9);
		padding-top: 2px;
		padding-bottom: 2px;
		text-shadow: none;
		transition: all 0.35s;

		transform: translateZ(0px);
	}

	/* Состояние "Первого клика" для мобильных (через класс .is-hovered ) */
	.catalog__card.is-hovered {
		box-shadow: -4px 4px 2px 2px rgba(255, 127, 80, 0.5); //rgb(var(--shadow), 0.9);
		outline: 4px solid coral;

		transition: box-shadow 0.05s;
		transition: all 0.5s;

		transform: rotate3d(1, 1, 0, 20deg);
		transform-style: preserve-3d;
	}

	.catalog__card.is-hovered .catalog__card--title {
		box-shadow: 0px 0px 30px rgb(var(--mainColorL), 0.9);
		border-top: 1px solid rgb(var(--mainColorL), 0.2);
		border-bottom: 1px solid rgb(var(--mainColorL), 0.2);
		color: coral; //rgb(var(--shadow), 1);
		min-width: 100%;
		width: fit-content;
		min-height: 4rem;
		font-size: 2rem;

		padding: 2px 4px;
		text-shadow: -2px 2px 2px rgb(var(--mainColorL), 0.9);

		transition: all 0.05s;

		transform: translateZ(50px) scale(1);
	}

	.catalog__card.is-hovered::before {
		position: absolute;
		bottom: -2px;
		content: '';
		background: transparent;
		width: 0%;
		height: 0px;
		transition: all 0.5s;
	}
</style>
