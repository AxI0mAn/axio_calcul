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

	//============  без салатового фона на мобильном при прокрутка по якорной ссылке

	// onMount гарантирует, что код выполнится в браузере после монтирования
	onMount(() => {
		function handleAnchorClick(e) {
			const link = e.target.closest('a');
			if (!link) return;

			const href = link.getAttribute('href');
			// Проверяем, что это якорная ссылка (начинается с # и содержит что-то после)
			if (href && href.startsWith('#') && href.length > 1) {
				const targetElement = document.querySelector(href);

				if (targetElement) {
					e.preventDefault(); // Отменяем резкий дефолтный прыжок

					targetElement.scrollIntoView({
						// плавный скролл через scrollIntoView заставляет движок телефона отрисовывать кадры пошагово, благодаря чему салатовый (технический) экран буфера графического процессора больше не просвечивает.
						behavior: 'smooth',
						block: 'start'
					});

					// Аккуратно обновляем URL в адресной строке без дерганья страницы
					history.pushState(null, '', href);
				}
			}
		}

		// Вешаем глобальный слушатель на весь документ
		document.addEventListener('click', handleAnchorClick);

		// Обязательно удаляем слушатель при размонтировании (хорошая практика)
		return () => {
			document.removeEventListener('click', handleAnchorClick);
		};
	});

	// ===========  Для плавного появления модалки с ячейками памяти
	//============ встроенные эффекты Svelte5
	import { cubicInOut } from 'svelte/easing';

	import { appState } from '$lib/store/appState.svelte';
	import BtnBlockMemo from '$lib/components/Btn/BtnBlockBase/BtnBlockMemo.svelte';

	import ModalBackdrop from '$lib/components/aBlock/modal/ModalBackdrop.svelte';

	// ============ модалка согласия появится через время наxождения на сайте
	let isTimerReady = $state(false);

	onMount(() => {
		// Таймер только для модалки соглашения (60 секунд)
		const timer = setTimeout(() => {
			isTimerReady = true;
		}, 100000);

		return () => clearTimeout(timer);
	});

	// ============ плавные переходы для работы QuickMenu.svelte
	import { menuMaps } from '$lib/config/mathMenuMaps';
	// АВТОМАТИЧЕСКАЯ ЛОГИКА:
	// 1. Берем все массивы из menuMaps (basic, engineer, и т.д.)
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
	<meta property="og:site_name" content="amoca" />
	<meta property="og:locale" content="en_US" />

	<meta
		name="description"
		content="One familiar interface for many Calculators that work together."
	/>
	<meta name="robots" content="index,follow,max-image-preview:large" />

	<meta property="og:type" content="website" />
	<meta property="og:title" content="amoca - a mobile calculator" />
	<meta
		property="og:description"
		content="A growing collection of calculators, converters and practical mathematical tools designed for everyday life, education, engineering and business."
	/>

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="amoca - a mobile calculator" />
	<meta
		name="twitter:description"
		content="A growing collection of calculators, converters and practical mathematical tools designed for everyday life, education, engineering and business."
	/>
	<meta name="twitter:image" content="https://axi0man.github.io/axio_calcul/ogImage/og_home.jpeg" />

	<link rel="apple-touch-icon" href="https://axi0man.github.io/axio_calcul/apple-touch-icon.png" />
	<link rel="canonical" href="https://axi0man.github.io/axio_calcul/" />
	<meta property="og:url" content="https://axi0man.github.io/axio_calcul/" />

	<meta property="og:image" content="https://axi0man.github.io/axio_calcul/ogImage/og_home.jpeg" />

	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:type" content="image/jpeg" />

	<title>amoca | Math Tools PWA</title>
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
<ModalBackdrop isOpen={appState.isMemoModalOpen}>
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
</ModalBackdrop>

<!-- Модалка согласие с PrivatePolise i disclaimer -->

<ModalBackdrop isOpen={isTimerReady && !appStore.iAgree}>
	<h3 class="youAgree">
		By continuing to use this app, you acknowledge that you have read and agree to the <strong
			>Privacy Policy</strong
		>
		and <strong>Disclaimer</strong>.
	</h3>

	<div class="modal-actions">
		<button class="btn btn__op btn__clear-all" onclick={() => (appStore.iAgree = true)}>
			I AGREE
		</button>
	</div>
</ModalBackdrop>

<style>
	.page-wrapper {
		width: 100%;
	}

	h3.youAgree {
		letter-spacing: 0.2rem;
		line-height: 1.5rem;
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
