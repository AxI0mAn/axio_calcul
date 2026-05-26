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
		initAccordion(); // аккордеон из нескольких <details> для домашнего каталога
	});

	// Double Tap Issue - перехватывает первый клик на мобильном устройстве
	import { initTouchHover } from '$lib/utils/initTouchHover';
	$effect(() => {
		initTouchHover('.catalog__card');
	});

	// кнопка ВВЕРХ
	import { createScrollTopButton } from '$lib/utils/createScrollTopButton';

	$effect(() => {
		// Запускаем создание и сохраняем функцию удаления
		const destroyButton = createScrollTopButton('top-anchor');

		// Эта часть сработает, когда пользователь уйдет с этой страницы
		return () => {
			destroyButton();
		};
	});

	//
	import HomeHeader from '$lib/components/aBlock/homeHeader/homeHeader.svelte';

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
	import srcFraction_jpeg from '$lib/assets/iconPng/512/png_Fraction.jpeg';
	import srcFraction_webp from '$lib/assets/iconPng/512/png_Fraction.webp';
</script>

<div class="app-wrapper">
	<aside class="field_left"></aside>
	<main class="field_main catalog" id="catalogAllFeatures">
		<div class="headerWrapper" id="top-anchor"><HomeHeader /></div>
		<h1 class="slogan font-digits">
			<span class="allFunc">44 functions</span> <span>in</span>
			<span class="allCalc">3 calculators</span>
		</h1>
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
					<!-- <div class="catalog__post">
						<a href="{base}/fraction" class="catalog__card">
							<Picture
								src={{
									webp: `${srcFraction_jpeg}`,
									jpeg: `${srcFraction_webp}`
								}}
								alt="Фон тригонометрического калькулятора"
								class="catalog__card--content"
								loading="eager"
								decoding="sync"
								//- только пиксели
								// width={512}
								// height={512}
							/>
							<h3 class="catalog__card--title"><span>fraction</span></h3>
						</a>
					</div> -->
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
	.field_main.catalog {
		width: 100%;
		background: $clr-bg-card;
		padding: 0.4rem;
		box-shadow: $shadow-deep;

		display: flex;
		flex-flow: column nowrap;
		justify-content: space-between;
		align-items: center;
		gap: 24px;

		position: relative;
	}
	.headerWrapper {
		width: 100%;
		z-index: 999;
	}
	.slogan {
		display: flex;
		flex-flow: column wrap;
		justify-content: center;
		align-items: center;

		margin-bottom: 2rem;

		font-size: 2.4rem;
		text-align: center;
		color: $clr-coral;
		.allCalc {
			color: $clr-mint-soft;
			font-weight: 777;
		}
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
		margin: 0 auto;
		width: 96%;
		overflow: hidden;

		display: flex;
		flex-flow: row wrap;
		justify-content: space-evenly;
		row-gap: 1rem;
		column-gap: clamp(0.5rem, 0.8929rem + 1.7857vw, 2.5rem);

		padding: 1rem;

		background: rgba($clr-bg-darker-rgb, 0.1);
		box-shadow:
			0px 0px 30px rgba($clr-coral-rgb, 0.4),
			$shadow-inset;
	}

	.catalog__post {
		width: 40%;
		height: fit-content;
		margin: 0px;
		padding: 0px;
	}

	.catalog__card {
		height: fit-content;

		position: relative;
		padding: 0px;

		border-radius: 12px;

		box-shadow: $shadow-card;

		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr;

		transition: all 0.35s;

		-webkit-tap-highlight-color: transparent;
		-webkit-touch-callout: none;
		user-select: none;
		touch-action: manipulation;
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
		color: $clr-mint-soft;
		text-align: center;

		backdrop-filter: blur(10px);
		background: rgba($clr-bg-darker-rgb, 0.3);
		box-shadow:
			0px 0px 16px rgba($clr-mint-soft-rgb, 0.4),
			$shadow-inset;

		border-top: 1px solid rgba($clr-coral-rgb, 0.2);
		border-bottom: 1px solid rgba($clr-coral-rgb, 0.2);
		transition: all 0.35s;
	}

	.groupCalc__title {
		min-height: 3rem;
		width: 90%;
		font-size: 1.5rem;
		cursor: pointer;

		border: 1px solid $clr-mint-soft;
		box-shadow: inset 0px 0px 12px $clr-mint-soft;

		&:hover {
			box-shadow:
				0px 0px 12px rgba($clr-coral-rgb, 0.4),
				$shadow-inset;
			border-top: none;
			border-right: 8px groove $clr-coral;
			border-bottom: none;
			border-left: 8px groove $clr-coral;
			transition: all 0.35s;

			outline: 2px solid $clr-blue-light;
			box-shadow:
				0 0 4px $clr-mint-soft,
				0 0 8px $clr-bg-card;
		}
	}

	.catalog__card--title {
		transform: scale(0.01);
	}

	/* Состояние Hover для устройств с мышью */
	@media (hover: hover) {
		.catalog__card:hover {
			box-shadow: -4px 4px 2px 2px rgba($clr-coral-rgb, 0.5);
			outline: 4px solid $clr-coral;

			transition: box-shadow 0.05s;
			transition: all 0.5s;

			transform: rotate3d(1, 1, 0, 20deg);
			transform-style: preserve-3d;
		}

		.catalog__card:hover .catalog__card--title {
			box-shadow: 0px 0px 30px rgba($clr-mint-rgb, 0.9);
			border-top: 1px solid rgba($clr-mint-rgb, 0.2);
			border-bottom: 1px solid rgba($clr-mint-rgb, 0.2);
			color: $clr-coral;
			min-width: 100%;
			width: fit-content;
			min-height: 4rem;
			font-size: 2rem;

			padding: 2px 4px;
			text-shadow: -2px 2px 2px rgba($clr-mint-rgb, 0.9);

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

	.catalog__card:active:not(.isHovered) {
		box-shadow: -4px 4px 2px 2px rgba(0, 0, 0, 0.3);
		outline: none;
		box-shadow: none;
		text-decoration: none;

		transition: all 0.1s;
		transform: rotate3d(0, 0, 0, 20deg);
		transform-style: preserve-3d;
	}

	.catalog__card:active:not(.isHovered) .catalog__card--title {
		backdrop-filter: blur(0px);
		box-shadow: none;
		border-top: none;
		border-bottom: none;
		color: rgba($clr-mint-rgb, 0.9);
		padding-top: 2px;
		padding-bottom: 2px;
		text-shadow: none;
		transition: all 0.35s;

		transform: translateZ(0px);
	}

	/* Состояние "Первого клика" для мобильных (через класс .isHovered ) */
	:global(.catalog__card.isHovered) {
		box-shadow: -4px 4px 2px 2px rgba($clr-coral-rgb, 0.5);
		outline: 4px solid $clr-coral;

		transition: box-shadow 0.05s;
		transition: all 0.5s;

		transform: rotate3d(1, 1, 0, 20deg);
		transform-style: preserve-3d;
	}

	:global(.catalog__card.isHovered .catalog__card--title) {
		box-shadow: 0px 0px 30px rgba($clr-mint-rgb, 0.9);
		border-top: 1px solid rgba($clr-mint-rgb, 0.2);
		border-bottom: 1px solid rgba($clr-mint-rgb, 0.2);
		color: $clr-coral;
		min-width: 100%;
		width: fit-content;
		min-height: 4rem;
		font-size: 2rem;

		padding: 2px 4px;
		text-shadow: -2px 2px 2px rgba($clr-mint-rgb, 0.9);

		transition: all 0.05s;

		transform: translateZ(50px) scale(1);
	}

	:global(.catalog__card.isHovered::before) {
		position: absolute;
		bottom: -2px;
		content: '';
		background: transparent;
		width: 0%;
		height: 0px;
		transition: all 0.5s;
	}
</style>
