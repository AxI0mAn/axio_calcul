<script>
	// @ts-ignore
	import { base } from '$app/paths';
</script>

<ul class="mainInstr">
	<h2>Still Have Questions? Learn More Below:</h2>
	<li>
		<a href="{base}/instructionInterface#instr_CalcPrecis">
			<h3>Adjusting calculation precision.</h3></a
		>
	</li>

	<li>
		<a href="{base}/instructionGeneral#instr_MainKeypad">
			<h3>Main keypad: Entering and deleting numbers.</h3></a
		>
	</li>

	<li>
		<a href="{base}/instructionGeneral#instr_OperKeypad">
			<h3>Basic operator keypad: +, −, ×, ÷, =, and decimal point.</h3></a
		>
	</li>

	<li>
		<a href="{base}/instructionGeneral#instr_MemoryKeypad">
			<h3>Memory buttons: Saving and recalling values.</h3></a
		>
	</li>

	<li>
		<a href="{base}/instructionInterface#instr_QuickNav">
			<h3>Quick navigation throughout the app.</h3></a
		>
	</li>

	<li><a href="{base}/instructionInterface"> <h3>More about Interface.</h3></a></li>

	<li><a href="{base}/instructionGeneral"> <h3>General Features</h3></a></li>

	<li><a href="{base}/instructionAll"> <h3>How use app.</h3></a></li>

	<li><a href="{base}/faq"> <h3>FAQ</h3></a></li>
</ul>

<style lang="scss">
	.mainInstr {
		padding: 1rem;
		margin: 0 auto;
		width: 100%;
		display: flex;
		flex-flow: column wrap;
		justify-content: space-around;
		align-items: flex-start;
		gap: 0.5rem;
		background-color: transparent;
		padding-bottom: 1rem;
		@media screen and (max-width: 500px) {
			padding: 1rem;
			align-items: center;
		}
		h2 {
			color: $clr-coral;
			margin-bottom: 1.5rem;
			font-size: 1.25rem;
		}
		li {
			color: $clr-white;
			margin-bottom: 0.5rem;

			&:hover {
				color: $clr-coral;
				transition: all 0.35s;
			}

			@media screen and (max-width: 500px) {
				text-align: center;
			}
		}
	}
</style>
