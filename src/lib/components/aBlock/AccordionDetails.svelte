<!-- 
ПРИМЕНЕНИЕ 

 <script>
 // плавное открытие  и мгновенное закрытие <details>
  import AccordionDetails from '$lib/components/AccordionDetails.svelte';

  // может быть открыт только один <details>
	import { onMount } from 'svelte';
	import { initAccordion } from '$lib/utils/initAccordion';

	onMount(() => {
		// Код внутри onMount никогда не запустится на сервере
		initAccordion(); // аккордеон из нескольких <details> для домашнего каталога
	});
</script>

  Пример с h2  
<AccordionDetails castomClass="optionCalc" name="my-accordion">
  {#snippet summary()}
    <h2>Arithmetic</h2>
  {/snippet}

  <ul>
    <li>Addition</li>
    <li>Subtraction</li>
  </ul>
</AccordionDetails>

  Пример с h4 
<AccordionDetails castomClass="optionCalc" name="my-accordion">
  {#snippet summary()}
    <h4>Advanced Fractions</h4>
  {/snippet}

  <p>Какой-то другой контент...</p>
</AccordionDetails>



-->

<script>
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	// В Svelte 5 принимаем два сниппета: summary и children
	let { castomClass, name = 'my-accordion', summary, children } = $props();

	let isOpen = $state(false);

	function handleToggle(e) {
		isOpen = e.target.open;
	}
</script>

<details class={castomClass} ontoggle={handleToggle} {name}>
	<!-- Пользователь сам решает, какой тег (h2, h3, h4) засунуть внутрь summary -->
	<summary>
		{@render summary?.()}
	</summary>

	{#if isOpen}
		<div transition:slide={{ duration: isOpen ? 300 : 0, easing: cubicOut }}>
			{@render children?.()}
		</div>
	{/if}
</details>

<style lang="scss">
	.optionCalc {
		overflow: hidden;
		summary {
			list-style: none;
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: space-between;
			user-select: none;

			&::-webkit-details-marker {
				display: none;
			}

			&::after {
				content: '';
				width: 8px;
				height: 8px;
				border-right: 2px solid currentColor;
				border-bottom: 2px solid currentColor;
				transform: rotate(45deg);
				transition: transform 0.3s ease;
			}
		}

		&[open] {
			summary::after {
				transform: rotate(-135deg);
			}
		}
	}

	.optionCalc {
		min-width: 100%;
		width: 100%;
		background: $clr-bg-card;
		border-radius: 1rem;
		margin-bottom: 1rem;
		box-shadow: $shadow-inset;
		overflow: hidden;
		transition: all 0.3s ease;

		summary {
			list-style: none; /* Убираем стандартный треугольник в Chrome/Safari/Firefox */
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: space-between;
			user-select: none;
			position: relative;
			background-color: transparent;
			transition: background-color 0.2s ease;

			/* Убираем дефолтный треугольник для старых версий Safari */
			&::-webkit-details-marker {
				display: none;
			}

			h3 {
				margin: 0;
				font-size: 1.1rem;
				font-weight: 600;
			}

			/* Создаем красивую анимированную стрелочку / плюсик справа */
			&::after {
				content: '';
				width: 0.5rem;
				height: 0.5rem;
				border-right: 2px solid $clr-mint;
				border-bottom: 2px solid $clr-mint;
				transform: rotate(45deg);
				transition: transform 0.3s ease;
				margin-left: 1rem;
			}

			align-self: flex-end;

			padding: 0.5rem 2rem;

			border-right: 2px solid rgba(255, 255, 255, 0.1);
			border-bottom: 2px solid rgba(255, 255, 255, 0.1);
			border-radius: 0.5rem;
			&:hover {
				color: $clr-coral;
				border-radius: 0.5rem;
				&::after {
					border-right: 2px solid $clr-coral;
					border-bottom: 2px solid $clr-coral;
				}
			}
		}

		/* Когда details открыт: меняем фон заголовка и разворачиваем стрелку */
		&[open] {
			summary {
				background-color: $grad-btn-main; /* Легкая подсветка активного раздела */

				&::after {
					transform: rotate(-135deg); /* Стрелочка смотрит вверх */
				}
			}
		}
	}
</style>
