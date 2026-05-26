<script>
	// @ts-ignore
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
			// Был $burger-color (#1e1e1e)
			fill: $clr-bg-darker;
			transition:
				transform 0.3s ease-in-out,
				opacity 0.3s ease-in-out;
			transform-origin: 0;
		}

		&:hover {
			.line {
				// При наведении иконка становится белой
				fill: $clr-white;
			}
		}

		/* Анимация перехода в "X" */
		&.is-active {
			.top {
				transform: translate(0, -17.5px) rotate(45deg);
				fill: $clr-white; // Белый крестик при закрытии
			}

			.middle {
				opacity: 0;
				transition: opacity 0s;
			}

			.bottom {
				transform: translate(0, 17.5px) rotate(-45deg);
				fill: $clr-white;
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

		// Вместо #eee
		border: 1px solid $clr-blue-light;

		// Вместо coral используем переменную (шапка меню)
		background-color: $clr-coral;

		// Добавим тень, чтобы меню "всплывало" над калькулятором
		box-shadow: $shadow-deep;
	}

	/* Интерактивный WRAPPER */
	.menu-button-wrapper {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		background: none;
		border: none;
		padding: 10px 15px;
		text-align: left;
		cursor: pointer;

		&:focus-visible {
			outline: 2px solid $clr-mint;
			outline-offset: -2px;
			background-color: rgba(255, 255, 255, 0.1);
		}
		&:active {
			background-color: rgba(0, 0, 0, 0.1);
		}
	}

	.menu-label {
		flex-grow: 1;
		// Текст на коралловом фоне делаем темным, как в шапке
		color: $clr-bg-darker;
	}

	/* Обертка для листовых элементов */
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
		color: $clr-bg-darker;
		transition: background-color 0.15s ease;
		-webkit-tap-highlight-color: transparent;
		touch-action: manipulation;

		&:focus-visible {
			outline: 2px solid $clr-mint;
			outline-offset: -2px;
			background-color: rgba(255, 255, 255, 0.1);
		}

		&:active {
			background-color: rgba(0, 0, 0, 0.1);
		}
	}

	/* Стили при наведении */
	@media (hover: hover) and (pointer: fine) {
		.menu-button-wrapper:hover,
		.menu-link:hover {
			background-color: rgba(255, 255, 255, 0.2);
		}
	}

	/* -------------------------------------- */
	/* СТИЛИ ДЛЯ ВЛОЖЕННОСТИ */
	/* -------------------------------------- */
	.sub-menu {
		margin: 5px 0 5px 15px;

		&.level-1 {
			padding-left: 20px;
			// Вместо #ccc
			border-left: 2px solid rgba($clr-bg-darker-rgb, 0.3);
		}

		&.level-2 {
			padding-left: 15px;
			border-left: 1px solid rgba($clr-bg-darker-rgb, 0.2);
		}
	}

	/* Треугольник */
	.triangle {
		width: 10px;
		height: 10px;
		fill: $clr-bg-darker;
		transition: transform 0.2s ease-in-out;
		transform-origin: 50% 50%;

		&.rotated {
			transform: rotate(90deg);
		}
	}
</style>
