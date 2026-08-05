<script>
	import BtnBack from '$lib/components/Btn/BtnBack.svelte';
	import { appStore } from '$lib/store/appStore.svelte';
	import { installPwaAction } from '$lib/utils/initPwaLogic';
	import BtnText from '$lib/components/Btn/BtnText.svelte';

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
</script>

<svelte:head>
	<meta name="robots" content="index,follow" />
	<title>amoca install</title>
</svelte:head>

<header class="header" id="top-anchor">
	<BtnBack />
	<h1 class="headerSlogan">install the App</h1>
</header>

<main class="homeTextPage installPage">
	<h2>Install in Less Than a Minute</h2>
	<section class="card">
		<p>
			This Application can be installed directly from your web browser as a Progressive Web App
			(PWA).
		</p>
		<p>
			Once installed, it works much like a native application, giving you quick access from your
			Home Screen or Desktop without visiting the website each time.
		</p>
		<p>
			Installation is free, takes less than a minute, and does not require an app store or user
			account.
		</p>
	</section>
	<h2>Why Install?</h2>
	<section class="card">
		<p>Installing the Application provides several benefits:</p>
		<ul>
			<li>Faster launch</li>
			<li>One-tap access from your Home Screen or Desktop</li>
			<li>A clean, app-like interface without browser tabs</li>
			<li>Offline support for many features</li>
			<li>Automatic updates</li>
			<li>No registration required</li>
			<li>No App Store download required</li>
			<li>Automatically Install</li>
		</ul>
	</section>
	{#if appStore.canInstall && !appStore.installed}
		<h2>Your browser supports direct installation.</h2>
		<section class="card">
			<p>Simply press the button below and follow the on-screen instructions.</p>
			<BtnText
				customClass="btn__install"
				onclick={() => {
					installPwaAction();
				}}
				buttonText="Install App Now!"
				svgContent=""
			/>
		</section>
	{:else if appStore.installed}
		<h2>The Application is already installed on this device.</h2>
		<p>You can open it directly from your Home Screen, Desktop, or Applications list.</p>
	{:else}
		<h2>Can't See the Install Button?</h2>
		Not every browser displays the installation prompt automatically. Some browsers require installation
		from their menu, while others use a different installation method. Choose the instructions below for
		your device.

		<section class="card">
			<h2>Android (Chrome, Edge, Brave)</h2>

			<p>Installing on Android is usually automatic.</p>

			<ul>
				<li>Open the Application.</li>
				<li>If an Install App button appears, tap it.</li>
				<li>If no button appears, open the browser menu (⋮).</li>
				<li>Select Install App or Add to Home Screen.</li>
				<li>Confirm the installation.</li>
			</ul>
			<p>The Application will then appear alongside your other installed apps.</p>
		</section>
		<section class="card">
			<h2>iPhone & iPad (Safari)</h2>

			<p>Apple currently requires manual installation of Progressive Web Apps.</p>
			<ul>
				<li>Open the Application in Safari.</li>
				<li>Tap the Share button.</li>
				<li>Scroll down and choose Add to Home Screen.</li>
				<li>Tap Add.</li>
			</ul>
			<p>The Application will now appear on your Home Screen just like a regular app.</p>
		</section>
		<section class="card">
			<h2>Windows & macOS (Chrome or Edge)</h2>
			<ul>
				<li>Open the Application.</li>
				<li>Look for the Install icon in the browser address bar.</li>
			</ul>
			<p>If you don't see it:</p>
			<ul>
				<li>Open the browser menu.</li>
				<li>Select Install App.</li>
				<li>Confirm.</li>
			</ul>
			<p>The Application can then be pinned to your desktop, taskbar, or Start menu.</p>
		</section>
	{/if}
</main>

<style lang="scss">
	// src/styles/_homePages.scss
	.installPage {
		color: rgba($clr-text-main-rgb, 0.8);
		letter-spacing: 0.1rem;
	}
	.card h2 {
		color: $clr-mint-soft;
	}
</style>
