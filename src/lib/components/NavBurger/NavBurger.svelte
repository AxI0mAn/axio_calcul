<script>
	import { base } from '$app/paths';
	import { clickOutside } from '$lib/utils/clickOutside';
	import { appStore } from '$lib/store/appStore.svelte';

	let isOpen = false;

	function close() {
		// console.log('MENU CLOSED');
		menuOpen = false;
	}

	// Руна $state для управления состоянием: открыто/закрыто
	let menuOpen = $state(false);

	// Данные для меню с вложенной структурой
	const menuItems = $state([
		{ label: 'Home', href: `${base}/` },
		{
			label: 'block (с вложениями)',
			href: '/shared/block',
			open: false,
			children: [
				{ label: 'textBlock', href: '/shared/block/textBlock' },
				{ label: 'textNum', href: '/shared/block/textNum' },
				{
					label: 'widget (с вложениями)',
					href: '#',
					open: false,
					children: [
						{ label: 'cards', href: '/widget/cards' },
						{ label: 'headers', href: '/widget/headers' }
					]
				},
				{ label: 'old history', href: `${base}/history` }
			]
		},
		{ label: 'old history', href: `${base}/history` },
		{ label: 'settings', href: `${base}/settings` }
	]);

	if (!appStore.installed) {
		menuItems.push({ label: 'install', href: `${base}/install` });
	}

	/**
	 * Переключает главное меню.
	 */
	function toggleMenu() {
		menuOpen = !menuOpen;
	}

	/**
	 * Переключает вложенный список для элемента.
	 * @param {Object} item - Объект элемента меню.
	 */
	function toggleSubMenu(item) {
		if (item.children) {
			item.open = !item.open;
		}
	}

	/**
	 * УНИФИЦИРОВАННЫЙ ОБРАБОТЧИК ДЕЙСТВИЯ (Клик) для кнопки-раскрывашки.
	 * @param {Event} event - Событие клика.
	 * @param {Object} item - Элемент меню.
	 */
	function handleToggleButton(event, item) {
		event.stopPropagation();
		toggleSubMenu(item);
	}

	/**
	 * Дополнительная функция для передачи на li.menu-item (листовой узел).
	 * Позволяет обрабатывать клик по конечному элементу списка.
	 * @param {Event} event - Событие клика.
	 */
	function handleLeafLinkClick(event) {
		// Здесь можно добавить логику закрытия всего меню после перехода по ссылке
		// toggleMenu();
	}
</script>

<div use:clickOutside={close} class="burger-menu" class:is-open={menuOpen}>
	<button
		class="burger-button"
		class:is-active={menuOpen}
		onclick={toggleMenu}
		aria-expanded={menuOpen}
		aria-controls="main-menu"
		title={menuOpen ? 'close submenu' : 'open submenu'}
	>
		<svg viewBox="0 0 100 100" width="40" aria-hidden="true" focusable="false">
			<rect class="line top" x="10" y="20" width="80" height="10" rx="5" />
			<rect class="line middle" x="10" y="45" width="80" height="10" rx="5" />
			<rect class="line bottom" x="10" y="70" width="80" height="10" rx="5" />
		</svg>
	</button>

	{#if menuOpen}
		<nav class="menu-nav" id="main-menu" aria-label="main menu">
			<ul class="main-menu">
				{#each menuItems as item}
					<li
						class="menu-item"
						class:has-children={!!item.children}
						class:is-open={item.open}
						role="none"
						onclick={(e) => !item.children && handleLeafLinkClick(e)}
					>
						{#if item.children}
							<!-- Семантический интерактивный элемент: button -->
							<button
								class="menu-button-wrapper"
								type="button"
								onclick={(e) => handleToggleButton(e, item)}
								aria-expanded={item.open}
								aria-controls={`submenu-${item.label.replace(/\s/g, '-')}`}
							>
								<span class="menu-label">{item.label}</span>

								<div
									class="triangle-container"
									title={item.open ? 'close submenu' : 'open submenu'}
									aria-hidden="true"
								>
									<svg
										class="triangle"
										class:rotated={item.open}
										viewBox="0 0 100 100"
										aria-hidden="true"
										focusable="false"
									>
										<polygon points="0,0 100,50 0,100" />
									</svg>
								</div>
							</button>
						{:else}
							<!-- Листовой элемент — обычная ссылка -->
							<div class="menu-link-wrapper">
								<a href={item.href} class="menu-link">
									{item.label}
								</a>
							</div>
						{/if}

						{#if item.children && item.open}
							<ul
								class="sub-menu level-1"
								id={`submenu-${item.label.replace(/\s/g, '-')}`}
								role="group"
							>
								{#each item.children as subItem}
									<li
										class="menu-item"
										class:has-children={!!subItem.children}
										class:is-open={subItem.open}
										role="none"
										onclick={(e) => !subItem.children && handleLeafLinkClick(e)}
									>
										{#if subItem.children}
											<button
												class="menu-button-wrapper"
												type="button"
												onclick={(e) => handleToggleButton(e, subItem)}
												aria-expanded={subItem.open}
												aria-controls={`submenu-${subItem.label.replace(/\s/g, '-')}`}
											>
												<span class="menu-label">{subItem.label}</span>

												<div
													class="triangle-container"
													title={subItem.open ? 'close submenu' : 'open submenu'}
													aria-hidden="true"
												>
													<svg
														class="triangle"
														class:rotated={subItem.open}
														viewBox="0 0 100 100"
														aria-hidden="true"
														focusable="false"
													>
														<polygon points="0,0 100,50 0,100" />
													</svg>
												</div>
											</button>
										{:else}
											<div class="menu-link-wrapper">
												<a href={subItem.href} class="menu-link">
													{subItem.label}
												</a>
											</div>
										{/if}

										{#if subItem.children && subItem.open}
											<ul
												class="sub-menu level-2"
												id={`submenu-${subItem.label.replace(/\s/g, '-')}`}
												role="group"
											>
												{#each subItem.children as deepSubItem}
													<li class="menu-item" role="none">
														<div class="menu-link-wrapper">
															<a href={deepSubItem.href} class="menu-link">
																{deepSubItem.label}
															</a>
														</div>
													</li>
												{/each}
											</ul>
										{/if}
									</li>
								{/each}
							</ul>
						{/if}
					</li>
				{/each}
			</ul>
		</nav>
	{/if}
</div>

<style lang="scss">
	/* -------------------------------------- */
	/* SCSS ПЕРЕМЕННЫЕ */
	/* -------------------------------------- */
	$burger-color: #fff;
	$burger-color-close: #fff;
	$menu-bg-color: #fff;
	$menu-bg-blur: rgba(255, 255, 255, 0.5);
	$link-color: #333;
	$hover-bg-color: #f0f0f0;
	$active-bg-color: #e0e0e0;
	$sub-menu-border: #ccc;
	$transition-speed: 0.3s;

	$accent: coral;
	$main-color: rgb(1, 217, 195); // Цвет текста
	$bg-color: rgb(15, 23, 42); // Фоновый цвет
	/* -------------------------------------- */
	/* ОБЩИЕ СТИЛИ */
	/* -------------------------------------- */
	.burger-menu {
		width: 100%;
		display: flex;
		flex-flow: column nowrap;
		justify-content: flex-start;
		align-items: flex-start;
		gap: 2rem;
		background-color: transparent;
		filter: none;
		position: relative;

		/* Стиль при открытом меню */
		&.is-open {
			background-color: transparent;
		}
	}

	.main-menu,
	.sub-menu {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	/* -------------------------------------- */
	/* КНОПКА-БУРГЕР */
	/* -------------------------------------- */
	.burger-button {
		background-color: transparent;
		border: none;
		padding: 0.5rem;
		cursor: pointer;
		outline: none;
		z-index: 1000;
		-webkit-tap-highlight-color: transparent;
		touch-action: manipulation;

		.line {
			fill: $burger-color;
			transition:
				transform $transition-speed ease-in-out,
				opacity $transition-speed ease-in-out;
			transform-origin: 0;
		}

		&:hover {
			.line {
				fill: $bg-color;
			}
		}

		/* Анимация перехода в "X" */
		&.is-active {
			.top {
				transform: translate(0, -17.5px) rotate(45deg);
				fill: $burger-color-close;
			}

			.middle {
				opacity: 0;
				transition: opacity 0s;
			}

			.bottom {
				transform: translate(0, 17.5px) rotate(-45deg);
				fill: $burger-color-close;
			}
		}
	}

	/* -------------------------------------- */
	/* МЕНЮ И ССЫЛКИ */
	/* -------------------------------------- */
	.menu-nav {
		position: absolute;
		top: 5rem;
		width: 300px;
		max-width: 90vw;
		z-index: 999;
		padding: 10px 0;
		border: 1px solid #eee;
		/* Фон для самого меню */
		background-color: coral;
	}

	/* Интерактивный WRAPPER для элементов с вложениями */
	.menu-button-wrapper {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;

		/* Сбрасываем дефолтные стили кнопки */
		background: none;
		border: none;
		padding: 10px 15px;
		text-align: left;
		cursor: pointer;

		/* Стили фокуса/активации для кнопки */
		&:focus-visible {
			outline: 2px solid $burger-color;
			outline-offset: -2px;
			background-color: $hover-bg-color;
		}
		&:active {
			background-color: $active-bg-color;
		}
	}

	.menu-label {
		flex-grow: 1;
		color: $link-color;
	}

	/* Обертка для листовых элементов, неинтерактивна */
	.menu-link-wrapper {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.menu-link {
		display: block;
		flex-grow: 1;
		padding: 10px 15px;
		text-decoration: none;
		color: $link-color;
		transition: background-color 0.15s ease;
		-webkit-tap-highlight-color: transparent;
		touch-action: manipulation;

		&:focus-visible {
			outline: 2px solid $burger-color;
			outline-offset: -2px;
			background-color: $hover-bg-color;
		}

		&:active {
			background-color: $active-bg-color;
		}
	}

	/* Стили при наведении (только для устройств с точным указателем) */
	@media (hover: hover) and (pointer: fine) {
		/* Наведение на кнопку-враппер */
		.menu-button-wrapper:hover {
			background-color: $hover-bg-color;
		}

		/* Наведение на обычную ссылку */
		.menu-item:not(.has-children) .menu-link-wrapper:hover {
			background-color: $hover-bg-color;
			.menu-link {
				background-color: $hover-bg-color;
			}
		}
	}

	/* -------------------------------------- */
	/* СТИЛИ ДЛЯ ВЛОЖЕННОСТИ */
	/* -------------------------------------- */
	.sub-menu {
		margin: 5px 0 5px 15px;

		&.level-1 {
			padding-left: 20px;
			border-left: 2px solid $sub-menu-border;
		}

		&.level-2 {
			padding-left: 15px;
			border-left: 1px solid $sub-menu-border;
		}

		.menu-link {
			padding: 8px 10px;
		}
	}

	/* Контейнер треугольника - ИСКЛЮЧИТЕЛЬНО ИНФОРМАТИВНЫЙ */
	.triangle-container {
		padding-left: 10px;
		padding-right: 5px;
		cursor: default;

		/* Убедимся, что фон применяется на всю область для hover */
		@media (hover: hover) and (pointer: fine) {
			.menu-button-wrapper:hover & {
				background-color: $hover-bg-color;
			}
		}
	}

	.triangle {
		width: 10px;
		height: 10px;
		fill: $link-color;
		transition: transform 0.2s ease-in-out;
		transform-origin: 50% 50%;
		transform: rotate(0deg);

		/* Поворот треугольника при открытом вложенном меню */
		&.rotated {
			transform: rotate(90deg);
		}
	}
</style>
