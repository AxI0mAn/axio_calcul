<script>
	/**
	 * домашняя страница src/routes/+page.svelte
	 */

	// ------------- ссылки с учётом локализации в будущем
	// @ts-ignore
	import { base } from '$app/paths';

	// может быть открыт только один <details>
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

	import srcExample_jpeg from '$lib/assets/iconPic/512/png_catalog.jpeg';
	import srcExample_webp from '$lib/assets/iconPic/512/png_catalog.webp';

	import srcLogo_webp from '$lib/assets/png_logo_transparent.png';

	import srcBasic_jpeg from '$lib/assets/iconPic/512/png_math_basic.jpeg';
	import srcBasic_webp from '$lib/assets/iconPic/512/png_math_basic.webp';
	import srcEngineer_jpeg from '$lib/assets/iconPic/512/png_math_engineer.jpeg';
	import srcEngineer_webp from '$lib/assets/iconPic/512/png_math_engineer.webp';
	import srcTrigonom_jpeg from '$lib/assets/iconPic/512/png_math_trigonometry.jpeg';
	import srcTrigonom_webp from '$lib/assets/iconPic/512/png_math_trigonometry.webp';
	import srcFraction_jpeg from '$lib/assets/iconPic/512/png_Fraction.jpeg';
	import srcFraction_webp from '$lib/assets/iconPic/512/png_Fraction.webp';
</script>

<div class="app-wrapper">
	<aside class="field_left"></aside>
	<main class="field_main catalog" id="catalogAllFeatures">
		<div class="headerWrapper" id="top-anchor"><HomeHeader /></div>
		<h1 class="slogan font-digits">
			<span class="allFunc font-digits">One workspace.</span>
			<span class="allCalc font-digits">Many possibilities.</span>
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
							<h3 class="catalog__card--title catalog__card--titleLong">
								<span>trigonometry</span>
							</h3>
						</a>
					</div>
					<div class="catalog__post">
						<a href="{base}/fraction" class="catalog__card">
							<Picture
								src={{
									webp: `${srcFraction_jpeg}`,
									jpeg: `${srcFraction_webp}`
								}}
								alt="Фон калькулятора дробей"
								class="catalog__card--content"
								loading="eager"
								decoding="sync"
								//- только пиксели
								// width={512}
								// height={512}
							/>
							<h3 class="catalog__card--title"><span>fraction</span></h3>
						</a>
					</div>
				</section>
			</details>
			<p class="inset">
				Learn one interface once and use it across a growing collection of calculators without
				learning a new workflow every time.
			</p>
			<!-- -->

			<details class="groupCalc" name="my-accordion">
				<summary>
					<h2 class="groupCalc__title">2D geometry calculators</h2>
				</summary>
				<section class="group__catalog">
					<div class="catalog__post">
						<a href="{base}/settings" class="catalog__card">
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
			<details class="groupCalc" name="my-accordion">
				<summary>
					<h2 class="groupCalc__title">3D geometry calculators</h2>
				</summary>
				<section class="group__catalog">
					<div class="catalog__post">
						<a href="{base}/settings" class="catalog__card">
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
			<details class="groupCalc" name="my-accordion">
				<summary>
					<h2 class="groupCalc__title">house helpers</h2>
				</summary>
				<section class="group__catalog">
					<div class="catalog__post">
						<a href="{base}/settings" class="catalog__card">
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
							<h3 class="catalog__card--title"><span>proportions</span></h3>
						</a>
					</div>
				</section>
			</details>
			<details class="groupCalc" name="my-accordion">
				<summary>
					<h2 class="groupCalc__title">converters</h2>
				</summary>
				<section class="group__catalog">
					<div class="catalog__post">
						<a href="{base}/settings" class="catalog__card">
							<Picture
								src={{
									webp: `${srcExample_webp}`,
									jpeg: `${srcExample_jpeg}`
								}}
								alt="Фон калькулятора пропорции"
								class="catalog__card--content"
								loading="eager"
								decoding="sync"
								//- только пиксели
								// width={512}
								// height={512}
							/>
							<h3 class="catalog__card--title"><span>weight</span></h3>
						</a>
					</div>
					<div class="catalog__post">
						<a href="{base}/settings" class="catalog__card">
							<Picture
								src={{
									webp: `${srcExample_webp}`,
									jpeg: `${srcExample_jpeg}`
								}}
								alt="Фон конвертера скоростей"
								class="catalog__card--content"
								loading="eager"
								decoding="sync"
								//- только пиксели
								// width={512}
								// height={512}
							/>
							<h3 class="catalog__card--title"><span>speed</span></h3>
						</a>
					</div>
					<div class="catalog__post">
						<a href="{base}/settings" class="catalog__card">
							<Picture
								src={{
									webp: `${srcExample_webp}`,
									jpeg: `${srcExample_jpeg}`
								}}
								alt="Фон конвертера времени"
								class="catalog__card--content"
								loading="eager"
								decoding="sync"
								//- только пиксели
								// width={512}
								// height={512}
							/>
							<h3 class="catalog__card--title"><span>time</span></h3>
						</a>
					</div>
					<div class="catalog__post">
						<a href="{base}/settings" class="catalog__card">
							<Picture
								src={{
									webp: `${srcExample_webp}`,
									jpeg: `${srcExample_jpeg}`
								}}
								alt="Фон конвертера площади"
								class="catalog__card--content"
								loading="eager"
								decoding="sync"
								//- только пиксели
								// width={512}
								// height={512}
							/>
							<h3 class="catalog__card--title"><span>area</span></h3>
						</a>
					</div>
				</section>
			</details>
			<details class="groupCalc" name="my-accordion">
				<summary>
					<h2 class="groupCalc__title">time & date</h2>
				</summary>
				<section class="group__catalog">
					<div class="catalog__post">
						<a href="{base}/settings" class="catalog__card">
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
							<h3 class="catalog__card--title"><span>day after day</span></h3>
						</a>
					</div>
				</section>
			</details>
		</div>
		<h2 class="inset">Learn more</h2>
	</main>
	<article class="instruction" id="instruction">
		<!-- текстовые блоки  и иллюстрации -->
		<div class="card">
			<h2>Calculators That Work Together</h2>
			<p>
				Compatible calculators have the same interface and can work together, allowing you to
				continue calculations without starting over:
			</p>
		</div>

		<div class="card">
			<ul>
				<li>Start with basic arithmetic.</li>
				<li>Continue with engineering functions.</li>
				<li>Switch to trigonometry.</li>
				<li>Work with fractions.</li>
				<li>Reuse previous results from calculation history.</li>
				<li>Save important values into memory.</li>
				<li>Keep working without retyping expressions.</li>
			</ul>
		</div>

		<div class="card">
			<h2>Four Memory Cell.</h2>
			<p>Frequently used values can be saved into memory and reused later.</p>
			<p>This makes solving larger problems much faster and more convenient.</p>
		</div>

		<div class="card">
			<h2>History page with old calculations.</h2>
			<p>
				Right in the calculator, you have access to the history of current calculations in this
				session.
			</p>
			<p>Previous calculations remain available in the calculation history.</p>
		</div>

		<div class="card">
			<h2>More facts for this App.</h2>
			<p>
				The app can be installed directly from your browser and works like a native app on your
				devices offline.
			</p>
			<p>
				Thise app stores data locally only on your device - you remain in control of that
				information.
			</p>
		</div>
	</article>

	<section class="reviews__old"></section>
	<aside class="field_right">
		<!-- advertisement картинки и банеры ?? -->
		<!-- <div class="realExamples">
			<h2>Real-World Examples</h2>
			<h2>Solve everyday math problems with practical examples.</h2>
		</div> -->
	</aside>
</div>

<footer>
	<ul>
		<!-- <li><a href="{base}/install"><span>How install App.</span></a></li>
		<li><a href="{base}/share"><span>How share App.</span></a></li>  -->
		<li><a href="{base}/faq"><span>FAQ</span></a></li>
		<li><a href="{base}/instructionAll"><span>Instruction for App.</span></a></li>
		<li><p></p></li>
		<li><a href="{base}/privacyPolicy"><span>Privacy Policy</span></a></li>
		<li><a href="{base}/disclaimer"><span>Disclaimer</span></a></li>
		<li><p></p></li>
		<li><a href="{base}/about"><span>About</span></a></li>
		<li><a href="{base}/contactUs"><span>Contact Us</span></a></li>
	</ul>
	<div class="footer_logo">
		<Picture
			src={{
				webp: `${srcLogo_webp}`
			}}
			alt="Logo for this App"
			class="catalog__card--content"
			loading="eager"
			decoding="sync"
			//- только пиксели
			// width={128}
			// height={128}
		/>
	</div>
	<h2 class="slogan">
		<span class="allFunc">One familiar interface </span>
		<span class="allCalc">for many Calculators</span>
		<span class=""> that work together.</span>
	</h2>
</footer>

<style lang="scss">
	.field_left,
	.instruction,
	.reviews__old,
	.field_right {
		color: $clr-mint-soft;
	}

	.instruction {
		display: flex;
		flex-flow: column;
		gap: 0.8rem;
		.card h2 {
			text-align: center;
		}
		.card p {
			text-align: left;
			line-height: 1.4rem;
		}
		.card ul li {
			line-height: 1.2rem;
			a span {
				font-size: 1.2rem;
				&:hover {
					color: $clr-coral;
					transition: all 1s;
				}
			}
		}
	}
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
		width: 90%;
		display: flex;
		flex-flow: column wrap;
		justify-content: center;
		align-items: center;

		margin-bottom: 2rem;
		line-height: calc(1.8vh + 1rem);
		font-size: calc(1.2vh + 1rem); // 2.4rem;
		text-align: center;
		color: $clr-coral;
		.allCalc {
			color: $clr-mint-soft;
			font-weight: 100;
		}
	}

	p {
		max-width: 92%;
		text-align: center;
		letter-spacing: 0.25rem;
		line-height: 1.4rem;
		font-size: 1.2rem;
		color: $clr-mint;
		font-weight: 400;
		margin-bottom: 1.4rem;
	}
	.inset {
		color: $clr-bg;
		text-shadow: 1px 1px 1px rgba($clr-text-main-rgb, 0.9);
	}
	// =============================================================
	.groupCalcAll {
		display: flex;
		flex-flow: column nowrap;
		justify-content: flex-start;
		align-items: center;
		flex: 1;
		gap: 1.6rem;
	}
	.groupCalc {
		display: flex;
		flex-flow: column nowrap;
		justify-content: flex-start;
		align-items: center;
		gap: 1.6rem;
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
		width: fit-content;
		height: fit-content;
		margin: 0px;
		padding: 0px;
	}

	.catalog__card {
		height: fit-content;
		width: 20vw;

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

		@media screen and (min-width: 768px) {
			width: 15vmin;
		}

		// --- РЕЖИМ:  TABLET PORTRAIT ---
		@media screen and (max-width: 767px) {
			min-width: 30vmin;
		}
		// --- РЕЖИМ:  mobile PORTRAIT ---
		@media (orientation: portrait) and (max-width: 560px) {
			min-width: 50vw;
		}
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

		font-weight: 800;
		color: $clr-mint-soft;
		text-align: center;
		// font-size: 1.2rem;

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
		font-size: calc(1vh + 1rem);
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
			// font-size: 2rem;
			font-size: calc(1vh + 1rem);

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

	footer {
		padding: 1rem;
		margin: 0 auto;
		width: 100%;
		display: flex;
		flex-flow: row wrap;
		justify-content: space-around;
		align-items: center;
		background-color: transparent;
		padding-bottom: 1rem;
		@media screen and (max-width: 500px) {
			padding: 1rem;
			flex-flow: column-reverse wrap;
			gap: 0.5rem;
		}
		ul {
			margin-bottom: 1rem;
			@media screen and (max-width: 500px) {
				margin-top: 1rem;
			}
		}
		li {
			color: $clr-white;
			margin-bottom: 0.5rem;

			&:hover {
				color: $clr-coral;
				transition: all 0.35s;
			}

			@media screen and (max-width: 500px) {
				text-align: center;
			}
		}
		.footer_logo {
			max-height: 100px;
			aspect-ratio: 1/1;
		}
		.slogan {
			max-width: fit-content;
		}
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
		// font-size: 2rem;
		font-size: calc(1vh + 1rem);

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
