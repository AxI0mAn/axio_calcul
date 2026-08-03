<script>
	// @ts-ignore
	import { base } from '$app/paths';
	import BtnBack from '$lib/components/Btn/BtnBack.svelte';
	import BtnText from '$lib/components/Btn/BtnText.svelte';

	// кнопка ВВЕРХ
	import { createScrollTopButton } from '$lib/utils/createScrollTopButton';

	$effect(() => {
		// Запускаем создание и сохраняем функцию удаления
		const destroyButton = createScrollTopButton('top-anchor');

		// Эта часть сработает, когда пользователь уйдет с этой страницы
		return () => {
			destroyButton();
		};
	});
</script>

<header class="header" id="top-anchor">
	<BtnBack />
	<h1 class="headerSlogan">General Features</h1>
</header>

<main class="homeTextPage faqPage">
	<div class="card" id="instr_MainKeypad">
		<!--{base}/instructionGeneral#instr_MainKeypad-->
		<h2>Main keypad: Entering and deleting numbers.</h2>
		<div>
			<p>The numeric keypad on the right includes the following buttons:</p>
			<ul>
				<li class="withIcon">
					<BtnText customClass="font-digits" buttonText="0" onclick={() => {}} /> ... <BtnText
						customClass="font-digits"
						buttonText="9"
						onclick={() => {}}
					/> - Number keys.
				</li>
				<li class="withIcon">
					<BtnText buttonText="." customClass="btn__op" onclick={() => {}} /> - Decimal point.
				</li>
				<li class="withIcon">
					<BtnText buttonText="+/-" customClass="btn__op" onclick={() => {}} /> - Change the sign of a
					number.
				</li>
				<li class="withIcon">
					<BtnText buttonText="⌫" customClass="backspace op-style btn__op" onclick={() => {}} /> - Delete
					the last digit.
				</li>
				<li class="withIcon">
					<BtnText buttonText="C" customClass="clear-btn btn__op" onclick={() => {}} /> - Clear the input
					field.
				</li>
			</ul>
		</div>
	</div>

	<div class="card">
		<h2>Clearing the current calculation history.</h2>
		<div>
			<p>
				To clear the current session history, swipe down from the top of the screen. On a computer,
				simply refresh the page.
			</p>
		</div>
	</div>

	<div class="card" id="instr_OperKeypad">
		<!--{base}/instructionGeneral#instr_OperKeypad-->
		<h2>Basic operator keypad: +, −, ×, ÷, =, and decimal point.</h2>
		<div>
			<p>
				To perform a basic calculation, enter the first number, tap a basic operator, enter the
				second number, then tap the <strong>=</strong> button.
			</p>
			<ul>
				<li class="withIcon">
					<BtnText customClass="op" onclick={() => {}} buttonText="+" /> - Addition.
				</li>
				<li class="withIcon">
					<BtnText customClass="op" onclick={() => {}} buttonText="-" /> - Subtraction.
				</li>
				<li class="withIcon">
					<BtnText customClass="op" onclick={() => {}} buttonText="*" /> - Multiplication.
				</li>
				<li class="withIcon">
					<BtnText customClass="op" onclick={() => {}} buttonText="/" /> - Division.
				</li>
				<li class="withIcon">
					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" /> - Calculate the
					result.
				</li>
			</ul>
		</div>
	</div>

	<div class="card" id="instr_MemoryKeypad">
		<!--{base}/instructionGeneral#instr_MemoryKeypad-->
		<h2>Memory buttons: Saving and recalling values.</h2>
		<div>
			<p>You have four memory slots available for storing values between calculations.</p>
			<div class="row">
				<BtnText buttonText="M1" customClass="btn btn__op btn__memo" onclick={() => {}} />
				<BtnText buttonText="M2" customClass="btn btn__op btn__memo" onclick={() => {}} />
				<BtnText buttonText="M3" customClass="btn btn__op  btn__memo" onclick={() => {}} />
				<BtnText buttonText="M4" customClass="btn btn__op  btn__memo" onclick={() => {}} />
			</div>
			<p>Memory slot features:</p>

			<ol>
				<li>
					Save the current input to a memory slot: tap a memory slot to store the value currently
					entered.
				</li>

				<li>
					Save a value from the current calculation history: press and hold (two second) the result
					you want to save.
				</li>

				<li>
					Save a value from a previous session: open the <strong>History</strong> page, then press and
					hold the result you want to save.
				</li>

				<li>
					Recall a value from a memory slot: tap the memory slot to insert the saved value into the
					current calculation. The memory slot will then be cleared.
				</li>

				<li>Double-tap a memory slot to copy its value to the input field.</li>

				<li>If all memory slots are full, you'll be prompted to choose which one to overwrite.</li>

				<li>
					You can see which value is stored in each memory slot in the current session history.
				</li>

				<li>
					Fractions are handled differently in Fraction Calculator mode. A fraction is stored as a
					fraction. When recalled in Fraction Calculator mode, it remains a fraction. When recalled
					in other calculator modes, it is automatically converted to a decimal.
				</li>
			</ol>
		</div>
	</div>

	<div class="card">
		<h2>Sending a result to another calculator.</h2>
		<div>
			<p>To transfer a value between calculators, use a memory slot.</p>
		</div>
	</div>

	<div class="navigatLink">
		<a class="nextLink" href="{base}/instructionBasic"><h3>next page: Basic Calculator</h3></a>
	</div>
</main>

<style lang="scss">
	.card {
		display: flex;
		flex-flow: column nowrap;
		justify-content: flex-start;
		align-items: flex-start;
		gap: 0.5rem;
		margin-bottom: 1rem;
		background-color: transparent;
		line-height: 1.75rem;
		&:hover {
			box-shadow: $shd-blue-glow;
		}
	}
	.learnMore {
		align-self: flex-end;

		padding: 0.5rem 2rem;

		border-right: 2px solid rgba(255, 255, 255, 0.1);
		border-bottom: 2px solid rgba(255, 255, 255, 0.1);
		border-radius: 0.5rem;
		&:hover {
			color: $clr-coral;
			border-right: 1px double $clr-coral;
			border-radius: 0.5rem;
		}
	}
	.navigatLink {
		margin-top: 6rem;
		position: relative;
		.nextLink {
			position: absolute;
			right: 2rem;
			bottom: 1rem;

			text-align: right;

			padding: 0.5rem 2rem;

			border-right: 2px solid rgba(255, 255, 255, 0.1);
			border-bottom: 2px solid rgba(255, 255, 255, 0.1);
			border-radius: 0.5rem;

			&:hover {
				color: $clr-coral;
				border-right: 1px solid $clr-coral;
				border-radius: 0.5rem;
				box-shadow: $shadow-neon-coral;
				transition: all 0.5s;
			}
		}
	}

	ol {
		padding-left: 2rem;
	}

	li.withIcon {
		margin-bottom: 0.75rem;
		display: flex;
		flex-flow: row nowrap;
		justify-content: start;
		align-items: center;
		gap: 0.5rem;
	}

	.row {
		max-width: 200px;
		padding: 8px;
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-template-rows: 1fr;
		gap: 4px;
		height: 100%;
		.btn {
			min-width: 40;
			aspect-ratio: 1/1;
		}
	}
</style>
