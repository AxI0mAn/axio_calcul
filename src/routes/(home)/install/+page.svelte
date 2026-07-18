<script>
	import { appStore } from '$lib/store/appStore.svelte';
	import { installPwaAction } from '$lib/utils/initPwaLogic';
	import BtnText from '$lib/components/Btn/BtnText.svelte';
</script>

<h1 class="header">install</h1>
<div class="install-page">
	<h3>страница install: краткое объяснение что установится как и зачем</h3>
	<ol>
		<li>
			если это iOS (Safari) - то показать инструкцию как установить Пользователи iPhone могут
			установить PWA только вручную через кнопку «Поделиться» (Share) -> «На экран "Домой"» (Add to
			Home Screen). Совет: Для iOS -> обычно показывают текстовую подсказку с картинкой
			(инструкцию), как именно нажать кнопку «Поделиться».
		</li>
		<li>
			если Android (Chrome) или Desktop (Chrome/Edge) - > (../../../Link to
			svelte5doc/assets/CODING/setupPWAbutton.md)
		</li>
	</ol>

	{#if appStore.canInstall && !appStore.installed}
		<h2>Если Ваш браузер поддерживает установку приложения, то</h2>
		<BtnText
			customClass="btn__install"
			onclick={() => {
				installPwaAction();
			}}
			buttonText="Install App Now!"
			svgContent=""
		/>
	{:else}
		<h2>
			Если Вы не видите яркую кнопку с надписью "УСТАНОВИТЬ СЕЙЧАС", значит что-то пошло не так или
			Ваш браузер не поддерживает установку приложения
		</h2>
	{/if}
</div>

<style lang="scss">
	.install-page {
		padding: 2rem;
		min-height: 100vw;
		color: $clr-text-main;
		line-height: 1.4rem;

		margin: 0 auto;
		max-width: 100vmin;
		margin-bottom: 25px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.header {
		color: $clr-coral;
		font-size: 3rem;
		display: inline-block;
		padding: 1rem 2rem;
		margin-bottom: 2rem;
	}
	@media (max-height: 500px) and (orientation: landscape),
		(max-width: 500px) and (orientation: portrait) {
		.header {
			font-size: 2rem;
		}
	}
</style>
