<script>
	import { appStore } from '$lib/store/appStore.svelte';
	import { installPwaAction } from '$lib/utils/initPwaLogic';
	import BtnText from '$lib/components/Btn/BtnText.svelte';
</script>

<div class="page">
	<h1>install</h1>

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

	<h2>Если Ваш браузер поддерживает установку приложения, то</h2>

	{#if appStore.canInstall && !appStore.installed}
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

<style>
	.page {
		padding: 2rem;
		min-height: 100vw;
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: flex-start;
		gap: 2rem;
		color: #fff;
	}
	h1 {
		color: coral;
		font-size: 80px;
	}
</style>
