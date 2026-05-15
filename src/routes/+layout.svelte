<script>
	// src/routes/+layout.svelte
	import '../styles/app.scss';
	import '../styles/_modal.scss';

	import favicon from '$lib/assets/favicon.png';
	let { children } = $props();
	// @ts-ignore
	import { page } from '$app/stores';
	// @ts-ignore
	import { base } from '$app/paths';

	// =========== для работы плагина SvelteKitPWA
	import { onMount } from 'svelte';

	import { pwaInfo } from 'virtual:pwa-info'; // Информация о манифесте

	onMount(() => {
		// Регистрируем Service Worker только в production
		// @ts-ignore
		if (typeof window !== 'undefined' && 'serviceWorker' in navigator && import.meta.env.PROD) {
			navigator.serviceWorker
				.register(`${base}/sw.js`, { scope: `${base}/` })
				.then(() => console.log('PWA: Service Worker зарегистрирован'))
				.catch((err) => console.error('PWA: Ошибка:', err));
		}
	});

	//============ встроенные эффекты Svelte5
	import { fade } from 'svelte/transition';
	import { blur } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';

	// ===========  Для плавного появления модалки с ячейками памяти

	import { appState } from '$lib/store/appState.svelte';
	import BtnBlockMemo from '$lib/components/Btn/BtnBlockBase/BtnBlockMemo.svelte';
	// export const prerender = true;
	// export const trailingSlash = 'always';

	// ============ плавные переходы для работы QuickMenu.svelte
	import { menuMaps } from '$lib/config/menuMaps';
	// АВТОМАТИЧЕСКАЯ ЛОГИКА:
	// 1. Берем все массивы из menuMaps (math, geometry, date и т.д.)
	// 2. Объединяем их в один плоский массив .flat()
	// 3. Проверяем, есть ли текущий путь в этом списке
	let isGroupPage = $derived(
		Object.values(menuMaps)
			.flat()
			.some((item) => item.href === $page.url.pathname)
	);
	// КАСТОМНЫЙ ПЕРЕХОД: Blur + Fade
	function blurFade(node, { duration = 300, delay = 0, amount = 10 }) {
		return {
			delay,
			duration,
			easing: cubicInOut,
			css: (t) => {
				// t — это число от 0 до 1 (прогресс анимации)
				// Нам нужно, чтобы при t=0 (начало) было размытие и прозрачность,
				// а при t=1 (конец) — четкость и полная видимость.
				return `
          opacity: ${t};
          filter: blur(${(1 - t) * amount}px);
        `;
			}
		};
	}

	// ===========  установка приложения
	import { appStore } from '$lib/store/appStore.svelte';
	import { initPwaLogic } from '$lib/utils/initPwaLogic.js';

	//===================== Проверяем возможность установки приложения
	// Этот код сработает ОДИН РАЗ при инициализации приложения
	$effect(() => {
		// Нам не нужно вешать слушатели на каждой странице. т.к. Окно (window) у нас одно на весь сеанс.
		if (!appStore.installed) {
			console.log('Проверяем возможность установки приложения src/routes/+layout.svelte');
			initPwaLogic();
		}
	});

	//======================== смена цветовой темы приложения
	// Руна $effect будет следить за изменением appStore.theme
	$effect(() => {
		document.documentElement.setAttribute('data-theme', appStore.theme);
	});

	// =========== настраиваем глобальный «слушатель» для мобильных устройств. Применяется для работы historyStore - сохранение истории в localStorage при выходе из приложения
	/**
	 * Настраиваем отслеживание состояния видимости страницы.
	 * Это самый надежный способ сохранить данные на мобильных устройствах.
	 */
	onMount(() => {
		const handleVisibilityChange = () => {
			// Когда пользователь сворачивает браузер, переключает вкладку
			// или закрывает приложение — состояние становится 'hidden'.
			if (document.visibilityState === 'hidden') {
				appState.saveAllActiveSessions();
			}
		};

		document.addEventListener('visibilitychange', handleVisibilityChange);

		// Чистим за собой при уничтожении макета
		return () => {
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>amoca</title>
</svelte:head>

{@html pwaInfo?.webManifest.linkTag}

{#key $page.url.pathname}
	<div
		class="page-wrapper"
		class:animating={isGroupPage}
		in:blurFade={{
			duration: isGroupPage ? 200 : 0,
			delay: isGroupPage ? 100 : 0,
			amount: 6
		}}
		out:blurFade={{
			duration: isGroupPage ? 50 : 0,
			amount: 12
		}}
	>
		{@render children()}
	</div>
{/key}

<!--  модалка, которая откроется при наведении и удержании на строке истории, если все ячейки памяти заняты  -->
{#if appState.isMemoModalOpen}
	<div class="modal-backdrop" transition:fade={{ duration: 150 }}>
		<div class="modal-content">
			<h3>Select slot to overwrite</h3>

			<div class="modal-grid">
				<BtnBlockMemo />
			</div>

			<div class="modal-actions">
				<button class="btn btn__op btn__clear-all" onclick={() => appState.clearAllMemory()}>
					CLEAR ALL
				</button>

				<button class="btn btn__cancel" onclick={() => (appState.isMemoModalOpen = false)}>
					Cancel
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.page-wrapper {
		width: 100%;
	}

	/* Применяем абсолютное позиционирование только во время анимации групповых страниц */
	.animating {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		will-change: filter, opacity;
	}
</style>
