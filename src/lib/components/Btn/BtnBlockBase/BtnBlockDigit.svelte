<script>
	/**
* btnBlockDigit.svelte

*/
	import BtnText from '../BtnText.svelte';
	import { backspace, toggleSign, addDecimal } from '$lib/services/base';
	import { addDigit, clear } from '$lib/services/calculatorActions.svelte.js';
</script>

<div class="digBlock">
	<div class="row">
		<BtnText buttonText="⌫" customClass="backspace op-style btn__op" onclick={() => backspace()} />

		<BtnText customClass="clear-btn btn__op" onclick={() => clear()} buttonText="C" />
	</div>
	<div class="row">
		<BtnText
			customClass="font-digits"
			onclick={() => {
				addDigit('7');
			}}
			buttonText="7"
		/>
		<BtnText
			customClass="font-digits"
			onclick={() => {
				addDigit('8');
			}}
			buttonText="8"
		/>
		<BtnText
			customClass="font-digits"
			onclick={() => {
				addDigit('9');
			}}
			buttonText="9"
		/>
	</div>
	<div class="row">
		<BtnText
			customClass="font-digits"
			onclick={() => {
				addDigit('4');
			}}
			buttonText="4"
		/>
		<BtnText
			customClass="font-digits"
			onclick={() => {
				addDigit('5');
			}}
			buttonText="5"
		/>
		<BtnText
			customClass="font-digits"
			onclick={() => {
				addDigit('6');
			}}
			buttonText="6"
		/>
	</div>
	<div class="row">
		<BtnText
			customClass="font-digits"
			onclick={() => {
				addDigit('1');
			}}
			buttonText="1"
		/>
		<BtnText
			customClass="font-digits"
			onclick={() => {
				addDigit('2');
			}}
			buttonText="2"
		/>
		<BtnText
			customClass="font-digits"
			onclick={() => {
				addDigit('3');
			}}
			buttonText="3"
		/>
	</div>
	<div class="row">
		<BtnText
			customClass="font-digits"
			onclick={() => {
				addDigit('0');
			}}
			buttonText="0"
		/>

		<BtnText buttonText="." customClass="btn__op" onclick={() => addDecimal()} />

		<BtnText buttonText="+/-" customClass="btn__op" onclick={() => toggleSign()} />
	</div>
</div>

<style lang="scss">
	.digBlock {
		padding: 8px;
		border: 1px solid transparent;
		border-top-left-radius: 8px;
		background-color: #86edf2;
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
	}
</style>
