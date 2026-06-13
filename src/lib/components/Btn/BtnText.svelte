<script>
	// атом - единичная кнопка
	// src/lib/components/Btn/BtnText.svelte
	let {
		buttonText = '',
		onclick,
		customClass = '',
		svgContent = '', // Для svg как ?raw
		Icon = null // Для svg как ?svelte
	} = $props();
</script>

<button class="btn font-digits {customClass}" {onclick}>
	{#if Icon}
		<Icon />
	{:else if svgContent}
		{@html svgContent}
	{/if}

	{#if buttonText}
		<span>{buttonText}</span>
	{/if}
</button>

<style lang="scss">
	.btn {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 4px 8px;
		font-size: 2rem;
		color: $clr-mint;
		cursor: pointer;
		transition: 0.25s ease;

		// Фон и заливка
		background-color: $clr-bg-card;
		background: $grad-btn-main;
		background-size: cover;
		background-position: center;

		border-radius: 8px;

		// Свечение (Внутреннее и внешнее)
		box-shadow:
			1px 1px 4px 0px rgba($clr-bg-darker-rgb, 0.5),
			inset 0px 0px 2px $clr-mint-soft;

		@media (orientation: portrait) and (max-width: 432px) {
			padding: 8px;
			font-size: 1.5rem;
		}
		@media (orientation: portrait) and (max-height: 670px) {
			padding: 4px;
			font-size: 1.2rem;
		}
		// --- Hover ---
		@media (hover: hover) and (pointer: fine) {
			&:hover {
				// Рамка (Берем синий из палитры)
				outline: 2px solid $clr-blue-light;
				background-color: #344e66; // Темно-синий акцент при наведении
				box-shadow:
					0 0 4px $clr-mint-soft,
					0 0 8px $clr-bg-card;
				transform: translateY(-0.5px);
			}
		}

		// --- Active ---
		&:active {
			-webkit-tap-highlight-color: transparent;
			outline: none;
			opacity: 0.8;
			background-color: $clr-slate; // #b6d9ff;
			transform: scale(0.96) translateY(0.5px);
			box-shadow:
				0 0 2px $shd-blue-glow,
				0 0 8px $clr-mint;
		}
	}

	// Модификаторы кнопок
	.btn.btn__op {
		background: $grad-op;
		color: $clr-sky; //$clr-text-main;
	}

	.btn.btn__func {
		padding: 2px 8px;
		font-size: calc(1vh + 1rem); //1.25rem;
		color: $clr-text-main;
		border: transparent;
		background: transparent;
		@media (orientation: portrait) and (max-height: 670px) {
			padding: 1px 4px;
			font-size: calc(1vh + 1rem);
		}
	}

	.btn.constanta {
		color: $clr-mint;
	}

	.btn.btn__memo.btn__memo--full {
		background: $grad-memo;
		color: $clr-bg-card;
	}

	.btn.btn__install {
		padding: 2rem;
		color: $clr-coral;
	}

	.btn.btn__install--mini {
		padding: 0.25rem;
		color: $clr-coral;
	}

	.btn.op.btn__func.trigonom {
		@media (orientation: portrait) and (max-height: 670px) {
			padding: 1px 4px;
			font-size: calc(1vh + 0.6rem);
		}
	}

	.btn.trigMode,
	.btn.fractionSwitch {
		padding: 2px 8px;
		font-size: 1.2rem;
		color: $clr-text-main;
		border: transparent;
		background: transparent;

		@media (hover: hover) and (pointer: fine) {
			&:hover {
				// Рамка (Берем синий из палитры)
				outline: 2px solid $clr-blue-light;
				background-color: #344e66; // Темно-синий акцент при наведении
				box-shadow:
					0 0 4px $clr-mint-soft,
					0 0 8px $clr-bg-card;
				transform: translateY(-0.5px);
			}
		}
		@media (orientation: portrait) and (max-height: 670px) {
			padding: calc(0.01rem + 1vh) 4px;
			font-size: 1rem;
		}
	}
	.btn.trigMode.action,
	.btn.fractionSwitch.action {
		color: $clr-coral;
		box-shadow:
			0 0 4px $clr-mint-soft,
			0 0 8px $clr-coral;
	}
</style>
