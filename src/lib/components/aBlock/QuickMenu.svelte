<script>
	// src/lib/components/aBlock/QuickMenu.svelte
	// * инструкция в /home/daxio/Desktop/Link to Projects/svelte5doc/assets/CODING/Система динамических меню и анимаций.docx

	import { appState } from '$lib/store/appState.svelte';
	import Picture from '$lib/components/Picture/Picture.svelte';
	import { clickOutside } from '$lib/utils/clickOutside';

	// @ts-ignore
	import { base } from '$app/paths';
	let { items } = $props();

	// Ищем текущий объект. Если не нашли, берем первый.
	let activeItem = $derived(items.find((i) => i.name === appState.now_mode) || items[0]);
	let detailsEl;

	const close = () => detailsEl.removeAttribute('open');
</script>

<div use:clickOutside={close} class="now_mode_container">
	<details bind:this={detailsEl}>
		<summary>
			<div class="mode-label">
				{#if activeItem}
					<Picture
						src={activeItem.img}
						alt={activeItem.name}
						class="quickMenu-icon"
						loading="eager"
						decoding="sync"
					/>
				{/if}
			</div>
		</summary>

		<nav class="dropdown">
			{#each items as item}
				{#if item.name !== appState.now_mode}
					<a href="{base}{item.href}" onclick={close} class="item">
						<Picture src={item.img} alt={item.name} loading="lazy" />
						<span class="name-tag">{item.name}</span>
					</a>
				{/if}
			{/each}
		</nav>
	</details>
</div>

<style lang="scss">
	.now_mode_container {
		z-index: 9999; // Поверх анимации страниц
	}

	details {
		display: block;
		position: relative;

		summary {
			list-style: none;
			cursor: pointer;
			background: transparent;
			border: 1px solid $clr-mint-soft;
			border-radius: 0.5rem;
			padding: 0.125rem;

			&::-webkit-details-marker {
				display: none;
			}

			// --- Hover ---
			@media (hover: hover) and (pointer: fine) {
				&:hover {
					outline: none;
					border: none;
					box-shadow: 0 0 8px 2px $clr-coral;
				}
			}
		}
	}

	.mode-label {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 60px;
		height: 60px;
	}

	.dropdown {
		position: absolute;
		top: 100%;
		right: 0;

		background: rgba($clr-bg-darker-rgb, 0.2);
		padding: 2px;

		display: flex;
		flex-flow: column wrap-reverse;
		justify-content: center;
		align-items: center;
		gap: 0.75rem;
		min-width: 60px;
		width: fit-content;
		max-height: 36vh;
	}

	.item {
		padding: 0.25rem;
		display: flex;
		flex-direction: column;
		justify-items: center;
		align-items: center;
		text-decoration: none;
		gap: 0.25rem;

		border: 1px solid $clr-mint;
		border-radius: 0.5rem;

		background-color: rgba($clr-bg-darker-rgb, 0.3);
		img {
			width: 40px;
			height: 40px;
		}

		// --- Hover ---
		@media (hover: hover) and (pointer: fine) {
			&:hover {
				outline: none;
				border: none;
				box-shadow: 0 0 8px 2px $clr-coral;

				.name-tag {
					color: $clr-coral;
				}
			}
		}
	}

	.name-tag {
		font-size: 0.6rem;
		color: $clr-mint;
		margin-top: 4px;
	}

	// Стили для картинок внутри компонента
	:global(.quickMenu-icon),
	:global(.item img) {
		min-width: 40px;
		min-height: 40px;
		object-fit: contain;
	}
</style>
