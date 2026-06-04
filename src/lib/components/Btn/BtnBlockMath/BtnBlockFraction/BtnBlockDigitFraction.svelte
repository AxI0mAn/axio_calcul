<script>
	/**
* src/lib/components/Btn/BtnBlockMath/BtnBlockFraction/BtnBlockDigitFraction.svelte
* клавиатура с цифрами , +/- backspace clear

*/
	import BtnText from '../../BtnText.svelte';
	import {
		backspaceFraction,
		clearFraction,
		addDigitFraction,
		toggleSignFraction
	} from '$lib/services/math/fractionActions.js';
</script>

<div class="digBlock">
	<div class="row">
		<BtnText
			buttonText="⌫"
			customClass="backspace op-style btn__op"
			onclick={() => backspaceFraction()}
		/>

		<BtnText buttonText="C" customClass="clear-btn btn__op" onclick={() => clearFraction()} />
	</div>
	<div class="row">
		<BtnText
			customClass="font-digits"
			onclick={() => {
				addDigitFraction('7');
			}}
			buttonText="7"
		/>
		<BtnText
			customClass="font-digits"
			onclick={() => {
				addDigitFraction('8');
			}}
			buttonText="8"
		/>
		<BtnText
			customClass="font-digits"
			onclick={() => {
				addDigitFraction('9');
			}}
			buttonText="9"
		/>
	</div>
	<div class="row">
		<BtnText
			customClass="font-digits"
			onclick={() => {
				addDigitFraction('4');
			}}
			buttonText="4"
		/>
		<BtnText
			customClass="font-digits"
			onclick={() => {
				addDigitFraction('5');
			}}
			buttonText="5"
		/>
		<BtnText
			customClass="font-digits"
			onclick={() => {
				addDigitFraction('6');
			}}
			buttonText="6"
		/>
	</div>
	<div class="row">
		<BtnText
			customClass="font-digits"
			onclick={() => {
				addDigitFraction('1');
			}}
			buttonText="1"
		/>
		<BtnText
			customClass="font-digits"
			onclick={() => {
				addDigitFraction('2');
			}}
			buttonText="2"
		/>
		<BtnText
			customClass="font-digits"
			onclick={() => {
				addDigitFraction('3');
			}}
			buttonText="3"
		/>
	</div>
	<div class="row">
		<BtnText
			customClass="font-digits"
			onclick={() => {
				addDigitFraction('0');
			}}
			buttonText="0"
		/>

		<BtnText customClass="btn__op" onclick={() => addDigitFraction('.')} buttonText="." />

		<BtnText buttonText="+/-" customClass="btn__op" onclick={() => toggleSignFraction()} />
	</div>
</div>

<style lang="scss">
	.digBlock {
		padding: 8px;
		border: 1px solid transparent;
		border-top-left-radius: 8px;
		background-color: $clr-mint-soft;
		height: 100%;
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: repeat(5, 1fr);
		gap: 8px;
		.row {
			display: flex;
			flex-flow: row wrap;
			width: 100%;
			height: 100%;
			gap: 8px;
		}

		@media screen and (max-width: 480px) and (orientation: portrait),
			screen and (max-height: 480px) and (orientation: landscape) {
			gap: 4px;
			.row {
				gap: 4px;
			}
		}
	}
</style>
