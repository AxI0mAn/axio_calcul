<script>
	/**
* btnBlockOp.svelte

*/
	import BtnText from '../BtnText.svelte';
	import { addOperator, performCalculation } from '$lib/services/calculatorActions.svelte.js';
</script>

<div class="operBlock">
	<div class="col">
		<BtnText
			customClass="op"
			onclick={() => {
				addOperator('-');
			}}
			buttonText="-"
		/>
		<BtnText
			customClass="op"
			onclick={() => {
				addOperator('+');
			}}
			buttonText="+"
		/>
		<BtnText
			customClass="op"
			onclick={() => {
				addOperator('/');
			}}
			buttonText="/"
			svgContent=""
		/>

		<BtnText
			customClass="op"
			onclick={() => {
				addOperator('*');
			}}
			buttonText="*"
		/>
	</div>
	<BtnText customClass="equal-btn btn__op" onclick={performCalculation} buttonText="=" />
</div>

<style lang="scss">
	.operBlock {
		// width: 100%;
		height: 100%;
		display: grid;
		grid-template-columns: 2fr 1fr;
		grid-template-rows: 1fr;
		padding: 8px;
		border: 1px solid transparent;
		background: #86edf2;
		gap: 8px;
		.col {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			grid-template-rows: repeat(2, 1fr);
			gap: 8px;
			height: 100%;
		}
		@media screen and (max-width: 480px) and (orientation: portrait),
			screen and (max-height: 480px) and (orientation: landscape) {
			gap: 4px;
			.col {
				gap: 4px;
			}
		}
	}
</style>
