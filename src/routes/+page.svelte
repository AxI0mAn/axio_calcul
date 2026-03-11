<script>
	import BtnText from '$lib/components/btnText.svelte';
	/**
	 * Управление состоянием калькулятора с помощью Svelte 5 Runes
	 */
	let display = $state('0');
	let firstValue = $state(null);
	let operator = $state(null);
	let waitingForNext = $state(false);
	let toFix = 6; // кол-во знаков после запятой в ответе

	/**
	 * Функция для вычисления результата
	 */
	function calculate(a, b, op) {
		switch (op) {
			case '+':
				return a + b;
			case '-':
				return a - b;
			case '*':
				return a * b;
			case '/':
				return b !== 0 ? a / b : 'Ошибка';
			default:
				return b;
		}
	}

	/**
	 * Смена знака (+/-)
	 */
	function toggleSign() {
		if (display === '0' || display === 'Ошибка') return;

		if (display.startsWith('-')) {
			display = display.slice(1);
		} else {
			display = '-' + display;
		}
	}

	/**
	 * Добавление десятичной точки
	 */
	function addDecimal() {
		if (waitingForNext) {
			display = '0.';
			waitingForNext = false;
			return;
		}

		// Проверяем, нет ли уже точки в числе
		if (display.indexOf('.') === -1) {
			display = display + '.';
		}
	}

	/**
	 * Добавление цифры на экран
	 */
	function addDigit(digit) {
		const isNewInput = display === '0' || waitingForNext;

		if (isNewInput) {
			display = String(digit);
			waitingForNext = false;
		} else {
			display = display + String(digit);
		}
	}

	/**
	 * Удаление последнего символа (Backspace)
	 */
	function backspace() {
		if (waitingForNext) return;
		if (display === 'Ошибка') {
			display = '0';
			return;
		}

		const nextVal = display.slice(0, -1);
		display = nextVal === '' || nextVal === '-' ? '0' : nextVal;
	}

	/**
	 * Выбор арифметической операции
	 */
	function handleOperator(nextOperator) {
		const inputValue = parseFloat(display);

		if (firstValue === null) {
			firstValue = inputValue;
		} else if (operator) {
			const result = calculate(firstValue, inputValue, operator);
			display = String(result);
			firstValue = result;
		}

		waitingForNext = true;
		operator = nextOperator;
	}

	/**
	 * ограничение знаков результата после запятой
	 */
	function float_toFixed(num) {
		return parseFloat(num.toFixed(toFix));
	}

	/**
	 * Финальный расчет результата (=)
	 */
	function performCalculation() {
		const canCalculate = operator !== null && !waitingForNext;

		if (canCalculate) {
			const secondValue = parseFloat(display);
			const calculat = calculate(firstValue, secondValue, operator);
			const result = float_toFixed(calculat);

			display = String(result);
			firstValue = null;
			operator = null;
			waitingForNext = true;
		}
	}

	/**
	 * Полная очистка
	 */
	function clear() {
		display = '0';
		firstValue = null;
		operator = null;
		waitingForNext = false;
	}
</script>

<div class="app-wrapper">
	<h1>Svelte 5: Calculator</h1>

	<div class="display-box">
		<span class="history">
			{firstValue !== null ? firstValue : ''}
			{operator || ''}
		</span>
		{display}
	</div>

	<div class="controls">
		<div class="row">
			<BtnText
				onclick={() => {
					addDigit(7);
				}}
				buttonText="7"
			/>
			<BtnText
				onclick={() => {
					addDigit(8);
				}}
				buttonText="8"
			/>
			<BtnText
				onclick={() => {
					addDigit(9);
				}}
				buttonText="9"
			/>
			<BtnText
				customClass="op"
				onclick={() => {
					handleOperator('/');
				}}
				buttonText="/"
			/>
		</div>

		<div class="row">
			<BtnText
				onclick={() => {
					addDigit(4);
				}}
				buttonText="4"
			/>
			<BtnText
				onclick={() => {
					addDigit(5);
				}}
				buttonText="5"
			/>
			<BtnText
				onclick={() => {
					addDigit(6);
				}}
				buttonText="6"
			/>
			<BtnText
				customClass="op"
				onclick={() => {
					handleOperator('*');
				}}
				buttonText="*"
			/>
		</div>

		<div class="row">
			<BtnText
				onclick={() => {
					addDigit(1);
				}}
				buttonText="1"
			/>
			<BtnText
				onclick={() => {
					addDigit(2);
				}}
				buttonText="2"
			/>
			<BtnText
				onclick={() => {
					addDigit(3);
				}}
				buttonText="3"
			/>
			<BtnText
				customClass="op"
				onclick={() => {
					handleOperator('-');
				}}
				buttonText="-"
			/>
		</div>

		<div class="row">
			<BtnText
				onclick={() => {
					addDigit(0);
				}}
				buttonText="0"
			/>

			<BtnText buttonText="." onclick={addDecimal} />

			<BtnText buttonText="+/-" customClass="op-style" onclick={toggleSign} />

			<BtnText
				customClass="op"
				onclick={() => {
					handleOperator('+');
				}}
				buttonText="+"
			/>
		</div>

		<div class="row">
			<BtnText buttonText="⌫" customClass="op-style" onclick={backspace} />

			<BtnText customClass="clear-btn" onclick={clear} buttonText="C" />

			<BtnText customClass="equal-btn" onclick={performCalculation} buttonText="=" />
		</div>

		<div class="row">
			<!-- <BtnText buttonText="sqrt" customClass="op-style" onclick={funcSqrt} /> корень квадратный-->
			<!-- <BtnText buttonText="1/x" customClass="op-style" onclick={division_by_x} /> -->
		</div>
	</div>
</div>

<style>
	:global(body) {
		background: #0f172a;
		color: #f8fafc;
		font-family: 'Segoe UI', system-ui, sans-serif;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		margin: 0;
	}

	:global(.row > *) {
		flex: 1 1 0;
		min-width: 0;
	}

	.app-wrapper {
		background: #1e293b;
		padding: 2rem;
		border-radius: 1.5rem;
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
		width: 320px;

		display: flex;
		flex-flow: column nowrap;
		justify-content: center;
		align-items: center;
	}

	.display-box {
		overflow: hidden;
		background: #0f172a;
		font-size: 2.5rem;
		padding: 1rem;
		text-align: right;
		border-radius: 0.75rem;
		margin-bottom: 1.5rem;
		min-height: 5rem;
		width: 90%;
		color: rgba(236, 17, 17, 0.8);
		/* color: rgba(120, 180, 255, 0.8); */
		font-family: 'Courier New', monospace;

		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		position: relative;
		border: 1px solid #334155;
	}

	.history {
		position: absolute;
		top: 5px;
		right: 10px;
		font-size: 1.2rem;
		color: #64748b;
	}
	.controls {
		width: fit-content;
		display: flex;
		flex-flow: column nowrap;
	}
	.row {
		align-self: stretch;
		display: flex;
		justify-content: space-between;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}
</style>
