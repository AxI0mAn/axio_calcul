<script>
	// @ts-ignore
	import { base } from '$app/paths';
	import BtnBack from '$lib/components/Btn/BtnBack.svelte';
	import { historyStore } from '$lib/store/historyStore.svelte';

	import Catalog from '$lib/assets/svgIcon/catalog.svg?raw';
	import History from '$lib/assets/svgIcon/history.svg?raw';
	import Info from '$lib/assets/svgIcon/info.svg?raw';
	import Install from '$lib/assets/svgIcon/download.svg?raw';
	import Share from '$lib/assets/svgIcon/share.svg?raw';

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

	// может быть открыт только один <details>
	import { onMount } from 'svelte';
	import { initAccordion } from '$lib/utils/initAccordion';

	onMount(() => {
		// Код внутри onMount никогда не запустится на сервере
		initAccordion(); // аккордеон из нескольких <details> для домашнего каталога
	});
</script>

<header class="header" id="top-anchor">
	<BtnBack />
	<h1 class="headerSlogan">Basic Calculator</h1>
</header>

<ul>
	<li>Basic operations: +, −, ×, ÷, =, and the decimal point.</li>
	<li>
		Additional function keypad:
		<ul>
			<li>Available constants.</li>
			<li>Calculating percentages.</li>
			<li>Calculating a factorial.</li>
			<li>Raising a number to a power.</li>
			<li>Calculating square roots.</li>
			<li>Rounding numbers.</li>
		</ul>
	</li>
	<li>Long and complex expressions.</li>
</ul>

<main class="homeTextPage faqPage">
	<div class="card">
		<h2>Main keypad: Entering and deleting numbers.</h2>
		<div>
			<p></p>
			<ul>
				<li>Y</li>
				<li>Y</li>
				<li>Y</li>
				<li>Y</li>
				<li>Y</li>
				<li>Y</li>
			</ul>
		</div>
		<a class="learnMore" href="{base}/settings">Click here to .......</a>
	</div>

	<div class="card">
		<h2>ers.</h2>
		<div>
			<p></p>
			<ul>
				<li>Y</li>
				<li>Y</li>
				<li>Y</li>
				<li>Y</li>
				<li>Y</li>
				<li>Y</li>
			</ul>
		</div>
		<a class="learnMore" href="{base}/settings">Click here to .......</a>
	</div>

	<div class="navigatLink">
		<a class="nextLink" href="{base}/instructionBasic"><h3>next page: Basic Calculator</h3></a>
	</div>
</main>

<style lang="scss">
	.card {
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

	li.withIcon {
		margin-bottom: 0.75rem;
		display: flex;
		flex-flow: row nowrap;
		justify-content: start;
		align-items: center;
		gap: 0.5rem;
	}
</style>
