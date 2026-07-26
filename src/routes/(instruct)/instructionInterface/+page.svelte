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
	<h1 class="headerSlogan">Getting Started</h1>
</header>

<main class="homeTextPage faqPage">
	<div class="card">
		<h2>Adjusting calculation precision.</h2>
		<div>
			<p>
				Calculation precision determines the number of digits displayed after the decimal point in
				the result.
			</p>
			<ul>
				<li>Open the <strong>☰</strong> menu.</li>
				<li>Select <strong>Settings</strong>.</li>
				<li>Find <strong>Calculation Precision</strong>.</li>
				<li>Move the slider.</li>
				<li>Choose the precision level that works best for you.</li>
				<li>Your settings are saved automatically.</li>
			</ul>
		</div>
		<a class="learnMore" href="{base}/settings"
			>Click here to adjust the calculation precision now.</a
		>
	</div>
	<div class="card">
		<h2>Configuring calculation history storage.</h2>
		<div>
			<p>Each time you open the app, a new calculation session begins.</p>

			<p>
				You can access previous calculation sessions from the main menu or from the quick navigation
				bar at the bottom of the calculator screen.
			</p>

			<ul>
				<li>Open the <strong>☰</strong> menu.</li>
				<li>Select <strong>Settings</strong>.</li>
				<li>Find <strong>Number of History Entries</strong>.</li>
				<li>Move the slider.</li>
				<li>Choose how many calculation sessions to keep in your history.</li>
				<li>Your settings are saved automatically.</li>
			</ul>
		</div>
		<a class="learnMore" href="{base}/settings"
			>Click here to adjust your calculation history settings.</a
		>
	</div>
	<div class="card">
		<h2>Reusing results from previous calculations.</h2>
		<div>
			<p>Your previous calculations are always available.</p>

			<p>
				Within the Math Calculators category, the calculator screen displays all calculations from
				the current session.
			</p>

			<p>
				On the <strong>History</strong> page, you can view calculations from different calculators that
				you've performed in previous sessions.
			</p>

			<p>
				Press and hold a calculation result on the <strong>History</strong> page to save it to a memory
				slot.
			</p>

			<p>
				You can later recall the saved value from the memory slot and use it in your current
				calculations.
			</p>
		</div>
		{#if Object.keys(historyStore.all).length !== 0}
			<a class="learnMore" href="{base}/history">Click here to try it now.</a>
		{/if}
	</div>
	<div class="card">
		<h2>Quickly switching between calculators within the same category.</h2>
		<div>
			<p>Calculators are organized into categories.</p>

			<p>All calculators within the same category share the same interface.</p>

			<p>
				On the calculator screen, the icon in the upper-right corner indicates which calculator
				you're currently using.
			</p>

			<p>
				Tap the calculator icon in the upper-right corner, then select another calculator to switch
				to it instantly.
			</p>

			<p>Quick switching is available only for selected calculator categories.</p>

			<p>
				When you switch calculators, your current input and calculation history are preserved for
				the current session within that calculator category.
			</p>
		</div>
		<a class="learnMore" href="{base}/basic">Try it now.</a>
	</div>
	<div class="card">
		<h2>Quick navigation throughout the app.</h2>
		<div>
			<p>On the calculator screen, you'll find a quick navigation bar below the numeric keypad.</p>

			<p>You can use this navigation bar to quickly access:</p>
			<ul>
				<li class="withIcon">{@html Catalog} - the Home page;</li>
				<li class="withIcon">{@html Info} - the Help &amp; FAQ page;</li>
				<li class="withIcon">{@html History} - the History page;</li>
				<li class="withIcon">{@html Install} - install the app;</li>
				<li class="withIcon">{@html Share} - share the app with your friends.</li>
			</ul>
		</div>
		<a class="learnMore" href="{base}/basic">View and try it now.</a>
	</div>
	<div class="navigatLink">
		<a class="nextLink" href="{base}/instructionGeneral"><h3>next page: General Features</h3></a>
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
