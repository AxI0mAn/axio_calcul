<script>
	// @ts-ignore
	import { base } from '$app/paths';
	import BtnText from '$lib/components/Btn/BtnText.svelte';

	// может быть открыт только один <details>
	import { onMount } from 'svelte';
	import { initAccordion } from '$lib/utils/initAccordion';

	onMount(() => {
		// Код внутри onMount никогда не запустится на сервере
		initAccordion(); // аккордеон из нескольких <details> для домашнего каталога
	});
</script>

<header class="header">
	<h1 class="headerSlogan">Engineering Calculator</h1>
</header>

<main class="homeTextPage faqPage">
	<div class="card">
		<h2>Introduction</h2>
		<h3>Advanced Scientific and Engineering Calculator</h3>
		<div>
			<p>
				The Engineering Calculator is designed for advanced mathematical calculations used in
				education, engineering, science, software development, finance, and everyday technical work.
			</p>
			<p>
				In addition to basic arithmetic, it supports powers, roots, logarithms, mathematical
				constants, prime factorization, divisor calculations, factorials, percentages, random number
				generation, and many other scientific functions.
			</p>
			<p>
				The calculator runs entirely in your browser, works on desktop and mobile devices, and can
				also be installed as a Progressive Web App for convenient offline use.
			</p>
		</div>
	</div>
	<div class="card">
		<h2>Features</h2>
		<p>The calculator includes the following functions:</p>

		<details class="optionCalc" name="my-accordion">
			<summary>
				<h3>Arithmetic</h3>
			</summary>
			<div>
				<ul>
					<ul>
						<li class="withIcon">
							Addition <BtnText customClass="op" onclick={() => {}} buttonText="+" />
						</li>
						<li class="withIcon">
							Subtraction <BtnText customClass="op" onclick={() => {}} buttonText="−" />
						</li>
						<li class="withIcon">
							Multiplication <BtnText customClass="op" onclick={() => {}} buttonText="*" />
						</li>
						<li class="withIcon">
							Division <BtnText customClass="op" onclick={() => {}} buttonText="/" />
						</li>
						<li class="withIcon">
							Parentheses for complex expressions <BtnText
								customClass="op btn__func constanta"
								onclick={() => {}}
								buttonText="("
							/>
							<BtnText customClass="op btn__func constanta" onclick={() => {}} buttonText=")" />
						</li>
					</ul>
				</ul>
			</div>
		</details>

		<details class="optionCalc" name="my-accordion">
			<summary>
				<h3>Powers and Roots</h3>
			</summary>
			<div>
				<ul>
					<li></li>
					<li></li>
					<li></li>
					<li></li>
					<li></li>
				</ul>
			</div>
		</details>

		<details class="optionCalc" name="my-accordion">
			<summary>
				<h3></h3>
			</summary>
			<div>
				<ul>
					<li></li>
					<li></li>
					<li></li>
					<li></li>
					<li></li>
				</ul>
			</div>
		</details>
	</div>

	<div class="card">
		<h2></h2>
		<div>
			<p></p>
			<p></p>
			<p></p>
		</div>
	</div>

	<div class="card">
		<h2></h2>
		<div>
			<p></p>
			<p></p>
			<p></p>
		</div>
	</div>
</main>

<style lang="scss">
	.card {
		width: 92%;
		margin: 0 auto;
		display: flex;
		flex-flow: column nowrap;
		justify-content: flex-start;
		align-items: flex-start;
		gap: 0.5rem;
		margin-bottom: 1rem;
		background-color: transparent;
		line-height: 1.75rem;
		&:hover {
			box-shadow: $shd-blue-glow;
		}
	}
	.learnMore {
		align-self: flex-end;

		padding: 0.5rem 2rem;

		border-right: 2px solid rgba(255, 255, 255, 0.1);
		border-bottom: 2px solid rgba(255, 255, 255, 0.1);
		border-radius: 0.5rem;
		&:hover {
			color: $clr-coral;
			border-right: 1px double $clr-coral;
			border-radius: 0.5rem;
		}
	}
	.navigatLink {
		margin-top: 6rem;
		position: relative;
		.nextLink {
			position: absolute;
			right: 2rem;
			bottom: 1rem;

			text-align: right;

			padding: 0.5rem 2rem;

			border-right: 2px solid rgba(255, 255, 255, 0.1);
			border-bottom: 2px solid rgba(255, 255, 255, 0.1);
			border-radius: 0.5rem;

			&:hover {
				color: $clr-coral;
				border-right: 1px solid $clr-coral;
				border-radius: 0.5rem;
				box-shadow: $shadow-neon-coral;
				transition: all 0.5s;
			}
		}
	}

	ol {
		padding-left: 2rem;
	}

	ul {
		padding: 0.25rem 0.5rem;
	}

	li.withIcon {
		margin-bottom: 0.75rem;
		display: flex;
		flex-flow: row nowrap;
		justify-content: start;
		align-items: center;
		gap: 0.5rem;
	}
	strong.answer {
		font-size: 3rem;
		font-weight: 600;
	}

	.optionCalc {
		min-width: 100%;
		width: fit-content;
		background: $clr-bg-card;
		border-radius: 1rem;
		margin-bottom: 1rem;
		box-shadow: $shadow-inset;
		overflow: hidden;
		transition: all 0.3s ease;

		summary {
			list-style: none; /* Убираем стандартный треугольник в Chrome/Safari/Firefox */
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: space-between;
			user-select: none;
			position: relative;
			background-color: transparent;
			transition: background-color 0.2s ease;

			/* Убираем дефолтный треугольник для старых версий Safari */
			&::-webkit-details-marker {
				display: none;
			}

			h3 {
				margin: 0;
				font-size: 1.1rem;
				font-weight: 600;
			}

			/* Создаем красивую анимированную стрелочку / плюсик справа */
			&::after {
				content: '';
				width: 0.5rem;
				height: 0.5rem;
				border-right: 2px solid $clr-mint;
				border-bottom: 2px solid $clr-mint;
				transform: rotate(45deg);
				transition: transform 0.3s ease;
				margin-left: 1rem;
			}

			align-self: flex-end;

			padding: 0.5rem 2rem;

			border-right: 2px solid rgba(255, 255, 255, 0.1);
			border-bottom: 2px solid rgba(255, 255, 255, 0.1);
			border-radius: 0.5rem;
			&:hover {
				color: $clr-coral;
				border-radius: 0.5rem;
				&::after {
					border-right: 2px solid $clr-coral;
					border-bottom: 2px solid $clr-coral;
				}
			}
		}

		/* Когда details открыт: меняем фон заголовка и разворачиваем стрелку */
		&[open] {
			summary {
				background-color: $grad-btn-main; /* Легкая подсветка активного раздела */

				&::after {
					transform: rotate(-135deg); /* Стрелочка смотрит вверх */
				}
			}
		}
	}
</style>
