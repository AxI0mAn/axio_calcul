<script>
	import BtnBack from '$lib/components/Btn/BtnBack.svelte';
	import { appStore } from '$lib/store/appStore.svelte';
	import { installPwaAction } from '$lib/utils/initPwaLogic';
	import BtnText from '$lib/components/Btn/BtnText.svelte';
</script>

<header class="header">
	<BtnBack />
	<h1 class="headerSlogan">install the App</h1>
</header>
<main class="homeTextPage installPage">
	<h2>Install in Less Than a Minute</h2>
	<p>
		This Application can be installed directly from your web browser as a Progressive Web App (PWA).
	</p>
	<p>
		Once installed, it works much like a native application, giving you quick access from your Home
		Screen or Desktop without visiting the website each time.
	</p>
	<p>
		Installation is free, takes less than a minute, and does not require an app store or user
		account.
	</p>
	<h2>Why Install?</h2>

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
	{#if appStore.canInstall && appStore.installed}
		<h2>Your browser supports direct installation.</h2>
		<p>Simply press the button below and follow the on-screen instructions.</p>
		<BtnText
			customClass="btn__install"
			onclick={() => {
				installPwaAction();
			}}
			buttonText="Install App Now!"
			svgContent=""
		/>
	{:else if appStore.installed}
		<h2>The Application is already installed on this device.</h2>
		<p>You can open it directly from your Home Screen, Desktop, or Applications list.</p>
	{:else}
		<h2>Can't See the Install Button?</h2>

		Not every browser displays the installation prompt automatically. Some browsers require
		installation from their menu, while others use a different installation method. Choose the
		instructions below for your device.

		<h3>Android (Chrome, Edge, Brave)</h3>

		<p>Installing on Android is usually automatic.</p>

		<ul>
			<li>Open the Application.</li>
			<li>If an Install App button appears, tap it.</li>
			<li>If no button appears, open the browser menu (⋮).</li>
			<li>Select Install App or Add to Home Screen.</li>
			<li>Confirm the installation.</li>
		</ul>
		<p>The Application will then appear alongside your other installed apps.</p>

		<h3>iPhone & iPad (Safari)</h3>

		<p>Apple currently requires manual installation of Progressive Web Apps.</p>
		<ul>
			<li>Open the Application in Safari.</li>
			<li>Tap the Share button.</li>
			<li>Scroll down and choose Add to Home Screen.</li>
			<li>Tap Add.</li>
		</ul>
		<p>The Application will now appear on your Home Screen just like a regular app.</p>

		<h3>Windows & macOS (Chrome or Edge)</h3>
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
	{/if}
</main>

<style lang="scss">
	// src/styles/_homePages.scss
	.installPage {
		color: $clr-mint-soft;
	}
</style>
