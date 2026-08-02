<script>
	// @ts-ignore
	import { base } from '$app/paths';
	import BtnText from '$lib/components/Btn/BtnText.svelte';
	import FineFraction from '../element/FineFraction.svelte';

	// может быть открыт только один <details>
	import { onMount } from 'svelte';
	import { initAccordion } from '$lib/utils/initAccordion';

	onMount(() => {
		// Код внутри onMount никогда не запустится на сервере
		initAccordion(); // аккордеон из нескольких <details> для домашнего каталога
	});

	// плавное открытие  и мгновенное закрытие <details>
	import AccordionDetails from '$lib/components/aBlock/AccordionDetails.svelte';
</script>

<!-- <AccordionDetails castomClass="optionCalc" name="my-accordion">
  {#snippet summary()} 
  {/snippet}
 
</AccordionDetails> -->

<header class="header">
	<h1 class="headerSlogan" id="instructionFraction">Fraction Calculator</h1>
</header>

<main class="homeTextPage calcInstrPage">
	<ul class="mainInstr">
		<h2>Contents:</h2>
		<li>
			<a href="{base}/fraction/#IntroductionFraction"> <h3>Introduction.</h3></a>
		</li>

		<li>
			<a href="{base}/fraction/#FeaturesFraction"> <h3>Features.</h3></a>
		</li>

		<li>
			<a href="{base}/fraction/#ExpressionBuilder"> <h3>Expression Builder.</h3></a>
		</li>
		<li>
			<ul>
				<li><a href="{base}/fraction/#ProperFraction"> <h3>Proper Fraction.</h3></a></li>
				<li><a href="{base}/fraction/#ImproperFraction"> <h3>Improper Fraction.</h3></a></li>
				<li><a href="{base}/fraction/#MixedNumber"> <h3>Mixed Number.</h3></a></li>
			</ul>
		</li>

		<li>
			<a href="{base}/fraction/#ExamplesFraction"> <h3>Examples.</h3></a>
		</li>

		<li>
			<a href="{base}/fraction/#StepMode"> <h3>How to Use Step-by-Step Mode.</h3></a>
		</li>

		<li>
			<a href="{base}/fraction/#EvCoExFraction">
				<h3>Examples for Complex Expressions with Fractions.</h3></a
			>
		</li>

		<li>
			<a href="{base}/fraction/#AvoidThComMistakesFraction">
				<h3>⚠️ Avoid These Common Mistakes.</h3></a
			>
		</li>

		<li>
			<a href="{base}/fraction/#mainInstr"> <h3>Lern more about Interface.</h3></a>
		</li>
	</ul>

	<div class="card" id="IntroductionFraction">
		<h2>Introduction</h2>
		<h3>Advanced Fraction Calculator</h3>
		<div>
			<p>
				The Fraction Calculator allows you to perform calculations with common ("stacked") fractions
				quickly and accurately.
			</p>
			<p>
				Unlike many online fraction calculators that require filling in separate input fields, this
				calculator lets you build complete mathematical expressions directly from the keypad, just
				like using a standard calculator.
			</p>
			<p>
				You can combine fractions, integers, constants, powers, roots, and arithmetic operations in
				a single expression.
			</p>
			<p>
				The calculator automatically evaluates the expression and provides the result in fractional
				form whenever possible.
			</p>
		</div>
	</div>

	<div class="card">
		<h2>Differences</h2>
		<div>
			<p>
				Why This Calculator Is Different Most online fraction calculators ask you to enter one
				fraction in one pair of input fields and another fraction in a second pair.
			</p>
			<p>This calculator works differently.</p>
			<p>
				It lets you build complete mathematical expressions directly from the keypad, similar to a
				scientific calculator.
			</p>
			<p>
				This makes it much easier to calculate long expressions without repeatedly filling in
				separate forms.
			</p>
		</div>
	</div>

	<div class="card" id="FeaturesFraction">
		<h2>Features</h2>
		<p>The calculator supports:</p>

		<div class="card">
			<h2>Fraction Tools</h2>
			<div>
				<ul>
					<li class="withIcon">
						Special symbol for entering the fraction bar
						<BtnText buttonText="÷" customClass="op-style btn__op " onclick={() => {}} />
					</li>
					<li class="withIcon">
						Convert fractions to decimals <BtnText
							buttonText=":."
							customClass="op btn__func constanta"
							onclick={() => {}}
						/>
					</li>
					<li class="withIcon">
						Convert decimals to fractions <BtnText
							buttonText=".:"
							customClass="op btn__func constanta"
							onclick={() => {}}
						/>
					</li>
					<li class="withIcon">
						Parentheses for complex expressions <BtnText
							customClass="op btn__func constanta"
							onclick={() => {}}
							buttonText="("
						/>
						<BtnText customClass="op btn__func constanta" onclick={() => {}} buttonText=")" />
					</li>
					<li class="withIcon">
						This mode shows not only the final answer but also a step-by-step solution for fraction
						calculations <BtnText
							buttonText="steps"
							customClass="op btn__func constanta fractionSwitch  action "
							onclick={() => {}}
						/>
					</li>
					<li>
						<AccordionDetails castomClass="optionCalc" name="my-accordion">
							{#snippet summary()}
								<h3>and more other:</h3>
							{/snippet}
							<div>
								<ul>
									<li class="withIcon">Simplify fractions</li>
									<li class="withIcon">Extract mixed numbers from improper fractions</li>
									<li class="withIcon">Work with proper and improper fractions</li>
								</ul>
							</div>
						</AccordionDetails>
					</li>
				</ul>
			</div>
		</div>

		<AccordionDetails castomClass="optionCalc" name="my-accordion">
			{#snippet summary()}
				<h3>Basic Fraction Operations</h3>
			{/snippet}
			<div>
				<ul>
					<li class="withIcon">
						Addition <BtnText customClass="op" onclick={() => {}} buttonText="+" />
					</li>
					<li class="withIcon">
						Subtraction <BtnText customClass="op" onclick={() => {}} buttonText="−" />
					</li>
					<li class="withIcon">
						Multiplication <BtnText customClass="op" onclick={() => {}} buttonText="*" />
					</li>
					<li class="withIcon">
						Division <BtnText customClass="op" onclick={() => {}} buttonText="/" />
					</li>
				</ul>
			</div>
		</AccordionDetails>

		<AccordionDetails castomClass="optionCalc" name="my-accordion">
			{#snippet summary()}
				<h3>Mathematical functions for fractions</h3>
			{/snippet}
			<div>
				<ul>
					<li class="withIcon">
						Square <BtnText buttonText="x²" customClass="op btn__func" onclick={() => {}} />
					</li>
					<li class="withIcon">
						Power <BtnText buttonText="xʸ" customClass="op btn__func" onclick={() => {}} />
					</li>
					<li class="withIcon">
						Square root <BtnText buttonText="√x" customClass="op btn__func" onclick={() => {}} />
					</li>
					<li class="withIcon">
						Mathematical constants π, e and √2

						<BtnText buttonText="π" customClass="op btn__func constanta" onclick={() => {}} />
						<BtnText buttonText="e" customClass="op btn__func constanta" onclick={() => {}} />
						<BtnText buttonText="√2" customClass="op btn__func constanta" onclick={() => {}} />
					</li>
				</ul>
			</div>
		</AccordionDetails>
	</div>

	<div class="card" id="ExpressionBuilder">
		<h2>Expression Builder</h2>
		<div>
			<p>
				Unlike most fraction calculators, this calculator allows you to enter long mathematical
				expressions containing multiple fractions and operations.
			</p>
			<p>Examples include expressions such as:</p>
			<p><strong class="example font-digits">(2÷3 + 5÷8) * (7÷4 − 1÷6)</strong></p>
			<p>After entering the expression, it will be displayed using stacked fractions:</p>
			<div>
				<FineFraction expr="	(2÷3 + 5÷8) * (7÷4 - 1÷6)" />
			</div>
			<p>or</p>
			<p><strong class="example font-digits">√(16÷25) + (3÷5)²</strong></p>
			<p>without switching between separate input fields:</p>
			<div><FineFraction expr="√(16÷25) + (3÷5)^2 " /></div>
		</div>
	</div>

	<h2>Intuitive fraction entry using parentheses.</h2>
	<div class="card" id="ProperFraction">
		<h2>Proper Fraction</h2>
		<div>
			<p>
				A <strong>proper fraction</strong> is a fraction whose numerator is less than its denominator.
			</p>
			<p>A proper fraction is always less than 1.</p>
			<ul>
				<li class="example">
					<div>
						<strong>For example, </strong><FineFraction expr="1÷4" /> or <FineFraction
							expr="(1÷4)"
						/>
					</div>
				</li>
				<li class="withIcon">
					<BtnText customClass="font-digits" buttonText="1" onclick={() => {}} />
					<BtnText buttonText="÷" customClass="op-style btn__op " onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="4" onclick={() => {}} />
					<strong>or</strong>
					<BtnText buttonText="(" customClass="op btn__func constanta" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="1" onclick={() => {}} />
					<BtnText buttonText="÷" customClass="op-style btn__op " onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="4" onclick={() => {}} />
					<BtnText buttonText=")" customClass="op btn__func constanta" onclick={() => {}} />
				</li>
			</ul>
		</div>
	</div>

	<div class="card" id="ImproperFraction">
		<h2>Improper Fraction</h2>
		<div>
			<p>
				An <strong>improper fraction</strong> is a fraction whose numerator is greater than or equal to
				its denominator.
			</p>
			<p>An improper fraction is always greater than or equal to 1.</p>
			<ul>
				<li class="example">
					<div>
						<strong>For example,</strong>
						<FineFraction expr="5÷4" /> or <FineFraction expr="(7÷7)" />
					</div>
				</li>
				<li class="withIcon">
					<BtnText customClass="font-digits" buttonText="5" onclick={() => {}} />
					<BtnText buttonText="÷" customClass="op-style btn__op " onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="4" onclick={() => {}} />
					<strong>or</strong>
					<BtnText buttonText="(" customClass="op btn__func constanta" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="7" onclick={() => {}} />
					<BtnText buttonText="÷" customClass="op-style btn__op " onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="7" onclick={() => {}} />
					<BtnText buttonText=")" customClass="op btn__func constanta" onclick={() => {}} />
				</li>
			</ul>
		</div>
	</div>

	<div class="card" id="MixedNumber">
		<h2>Mixed Number</h2>
		<div>
			<p>
				A <strong>mixed number</strong> is a number that consists of a whole number and a fraction.
			</p>
			<p>The fractional part of a mixed number is typically a proper fraction.</p>
			<ul>
				<li class="example">
					<div>
						<strong>For example, </strong><FineFraction expr="2(1÷3)" /> or <FineFraction
							expr="7(7÷77)"
						/>
					</div>
				</li>
				<li class="withIcon">
					<BtnText customClass="font-digits" buttonText="2" onclick={() => {}} />
					<BtnText buttonText="(" customClass="op btn__func constanta" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="1" onclick={() => {}} />
					<BtnText buttonText="÷" customClass="op-style btn__op " onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="3" onclick={() => {}} />
					<BtnText buttonText=")" customClass="op btn__func constanta" onclick={() => {}} />
				</li>
				<li class="withIcon"><strong>or</strong></li>
				<li class="withIcon">
					<BtnText customClass="font-digits" buttonText="7" onclick={() => {}} />
					<BtnText buttonText="(" customClass="op btn__func constanta" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="7" onclick={() => {}} />
					<BtnText buttonText="÷" customClass="op-style btn__op " onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="7" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="7" onclick={() => {}} />
					<BtnText buttonText=")" customClass="op btn__func constanta" onclick={() => {}} />
				</li>
			</ul>
		</div>
	</div>

	<div class="card" id="ExamplesFraction">
		<h2>Examples:</h2>
		<div>
			<ul>
				<li class="example">
					<strong>Addition</strong>
				</li>
				<li><FineFraction expr=" 1÷2 + 3÷4 = 1(1÷4)" /></li>
				<li>Enter into the calculator:</li>
				<li class="withIcon tenMore">
					<BtnText buttonText="1" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="÷" customClass="op-style btn__op " onclick={() => {}} />
					<BtnText buttonText="2" customClass="font-digits" onclick={() => {}} />

					<BtnText buttonText="+" customClass="op" onclick={() => {}} />

					<BtnText buttonText="3" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="÷" customClass="op-style btn__op " onclick={() => {}} />
					<BtnText buttonText="4" customClass="font-digits" onclick={() => {}} />

					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />

					<FineFraction expr="1(1÷4)" />
				</li>
			</ul>
		</div>

		<div>
			<ul>
				<li class="example">
					<strong>Subtraction</strong>
				</li>
				<li><FineFraction expr="7÷8 - 3÷8 = 1÷2 " /></li>
				<li>Enter into the calculator:</li>
				<li class="withIcon tenMore">
					<BtnText buttonText="7" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="÷" customClass="op-style btn__op " onclick={() => {}} />
					<BtnText buttonText="8" customClass="font-digits" onclick={() => {}} />

					<BtnText buttonText="-" customClass="op" onclick={() => {}} />

					<BtnText buttonText="3" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="÷" customClass="op-style btn__op " onclick={() => {}} />
					<BtnText buttonText="8" customClass="font-digits" onclick={() => {}} />

					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />

					<FineFraction expr="1÷2" />
				</li>
			</ul>
		</div>

		<div>
			<ul>
				<li class="example">
					<strong>Multiplication</strong>
				</li>
				<li><FineFraction expr="2÷3 * 9÷10 = 3÷5 " /></li>
				<li>Enter into the calculator:</li>
				<li class="withIcon tenMore">
					<BtnText buttonText="2" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="÷" customClass="op-style btn__op " onclick={() => {}} />
					<BtnText buttonText="3" customClass="font-digits" onclick={() => {}} />

					<BtnText buttonText="*" customClass="op" onclick={() => {}} />

					<BtnText buttonText="9" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="÷" customClass="op-style btn__op " onclick={() => {}} />
					<BtnText buttonText="1" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="0" customClass="font-digits" onclick={() => {}} />

					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />

					<FineFraction expr="3÷5" />
				</li>
			</ul>
		</div>

		<div>
			<ul>
				<li class="example">
					<strong>Division</strong>
				</li>
				<li><FineFraction expr="5÷6 / 2÷3 = 1(1÷4) " /></li>
				<li>Enter into the calculator:</li>
				<li class="withIcon tenMore">
					<BtnText buttonText="5" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="÷" customClass="op-style btn__op " onclick={() => {}} />
					<BtnText buttonText="6" customClass="font-digits" onclick={() => {}} />

					<BtnText buttonText="/" customClass="op" onclick={() => {}} />

					<BtnText buttonText="2" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="÷" customClass="op-style btn__op " onclick={() => {}} />
					<BtnText buttonText="3" customClass="font-digits" onclick={() => {}} />

					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />

					<FineFraction expr="1(1÷4)" />
				</li>
			</ul>
		</div>

		<div>
			<ul>
				<li class="example">
					<strong>Simplifying Fractions</strong>
				</li>
				<li><FineFraction expr=" 36÷48" /> 🠆 <FineFraction expr=" 3÷4" /></li>
				<li>Enter into the calculator:</li>
				<li class="withIcon tenMore">
					<BtnText buttonText="3" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="6" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="÷" customClass="op-style btn__op " onclick={() => {}} />
					<BtnText buttonText="4" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="8" customClass="font-digits" onclick={() => {}} />

					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />

					<FineFraction expr="3÷4" />
				</li>
			</ul>
		</div>

		<div>
			<ul>
				<li class="example">
					<strong>Improper Fraction</strong>
				</li>
				<li><FineFraction expr=" 17÷5" /> 🠆 <FineFraction expr=" 3(2÷5)" /></li>
				<li>Enter into the calculator:</li>
				<li class="withIcon tenMore">
					<BtnText buttonText="1" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="7" customClass="font-digits" onclick={() => {}} />

					<BtnText buttonText="÷" customClass="op-style btn__op " onclick={() => {}} />
					<BtnText buttonText="5" customClass="font-digits" onclick={() => {}} />

					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />

					<FineFraction expr="3(2÷5)" />
				</li>
			</ul>
		</div>

		<div>
			<ul>
				<li class="example">
					<strong>Fraction to Decimal</strong>
				</li>
				<li><FineFraction expr="3÷8" /> 🠆 <strong class="answer font-digits">0.375</strong></li>
				<li>Enter into the calculator:</li>
				<li class="withIcon tenMore">
					<BtnText buttonText="3" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="÷" customClass="op-style btn__op " onclick={() => {}} />
					<BtnText buttonText="8" customClass="font-digits" onclick={() => {}} />

					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />

					<strong class="answer font-digits">0.375</strong>
				</li>
			</ul>
		</div>

		<div>
			<ul>
				<li class="example">
					<strong>Decimal to Fraction</strong>
				</li>
				<li><strong class="answer font-digits">0.625</strong> 🠆 <FineFraction expr=" 5÷8" /></li>
				<li>Enter into the calculator:</li>
				<li class="withIcon tenMore">
					<BtnText buttonText="0" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="." customClass="btn__op" onclick={() => {}} />
					<BtnText buttonText="6" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="2" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="5" customClass="font-digits" onclick={() => {}} />

					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />

					<FineFraction expr="5÷8" />
				</li>
			</ul>
		</div>

		<div>
			<ul>
				<li class="example">
					<strong>Raise a Fraction to a Power</strong>
				</li>
				<li><FineFraction expr="(3÷4)^2" /></li>
				<li>Enter into the calculator:</li>
				<li class="withIcon tenMore">
					<BtnText buttonText="(" customClass="op btn__func constanta" onclick={() => {}} />
					<BtnText buttonText="3" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="÷" customClass="op-style btn__op " onclick={() => {}} />
					<BtnText buttonText="4" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText=")" customClass="op btn__func constanta" onclick={() => {}} />
					<BtnText buttonText="x^2" customClass="op btn__func" onclick={() => {}} />

					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />

					<FineFraction expr="9÷16" />
				</li>
			</ul>
		</div>

		<div>
			<ul>
				<li class="example">
					<strong> Raise the Numerator to Power. </strong>
				</li>
				<li><FineFraction expr=" 3^3÷41" /></li>
				<li>Enter into the calculator:</li>
				<li class="withIcon tenMore">
					<BtnText buttonText="3" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="x^y" customClass="op btn__func" onclick={() => {}} />
					<BtnText buttonText="3" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="÷" customClass="op-style btn__op " onclick={() => {}} />
					<BtnText buttonText="4" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="1" customClass="font-digits" onclick={() => {}} />

					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />

					<FineFraction expr="27÷41" />
				</li>
			</ul>
		</div>

		<div>
			<ul>
				<li class="example">
					<strong> Raise the Denominator to Power. </strong>
				</li>
				<li><FineFraction expr=" 5÷2^7" /></li>
				<li>Enter into the calculator:</li>
				<li class="withIcon tenMore">
					<BtnText buttonText="5" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="÷" customClass="op-style btn__op " onclick={() => {}} />
					<BtnText buttonText="2" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="x^y" customClass="op btn__func" onclick={() => {}} />
					<BtnText buttonText="7" customClass="font-digits" onclick={() => {}} />

					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />

					<FineFraction expr="5÷128" />
				</li>
			</ul>
		</div>

		<div>
			<ul>
				<li class="example">
					<strong> Raise the Numerator and Denominator to Different Powers. </strong>
				</li>
				<li><FineFraction expr=" 5^3÷7^4" /></li>
				<li>Enter into the calculator:</li>
				<li class="withIcon tenMore">
					<BtnText buttonText="5" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="x^y" customClass="op btn__func" onclick={() => {}} />
					<BtnText buttonText="3" customClass="font-digits" onclick={() => {}} />

					<BtnText buttonText="÷" customClass="op-style btn__op " onclick={() => {}} />

					<BtnText buttonText="7" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="x^y" customClass="op btn__func" onclick={() => {}} />
					<BtnText buttonText="4" customClass="font-digits" onclick={() => {}} />

					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />

					<FineFraction expr="125÷2401" />
				</li>
			</ul>
		</div>

		<div>
			<ul>
				<li class="example">
					<strong>Square Root Fraction</strong>
				</li>
				<li><FineFraction expr="√(81÷100)" /></li>
				<li>Enter into the calculator:</li>
				<li class="withIcon tenMore">
					<BtnText customClass="op btn__func" onclick={() => {}} buttonText="&Sqrt;x" />

					<BtnText buttonText="(" customClass="op btn__func constanta" onclick={() => {}} />
					<BtnText buttonText="8" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="1" customClass="font-digits" onclick={() => {}} />

					<BtnText buttonText="÷" customClass="op-style btn__op " onclick={() => {}} />

					<BtnText buttonText="1" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="0" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="0" customClass="font-digits" onclick={() => {}} />

					<BtnText buttonText=")" customClass="op btn__func constanta" onclick={() => {}} />
					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />

					<FineFraction expr="9÷10" />
				</li>
			</ul>
			<ul>
				<li class="example">
					<strong>Square Root for Numerator</strong>
				</li>
				<li><FineFraction expr="√(81)÷100" /></li>
				<li>Enter into the calculator:</li>
				<li class="withIcon tenMore">
					<BtnText customClass="op btn__func" onclick={() => {}} buttonText="&Sqrt;x" />

					<BtnText buttonText="(" customClass="op btn__func constanta" onclick={() => {}} />
					<BtnText buttonText="8" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="1" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText=")" customClass="op btn__func constanta" onclick={() => {}} />

					<BtnText buttonText="÷" customClass="op-style btn__op " onclick={() => {}} />

					<BtnText buttonText="1" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="0" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="0" customClass="font-digits" onclick={() => {}} />

					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />

					<FineFraction expr="9÷100" />
				</li>
			</ul>
			<ul>
				<li class="example">
					<strong>Square Root for Denominator</strong>
				</li>
				<li><FineFraction expr="81/√(100)" /></li>
				<li>Enter into the calculator:</li>
				<li class="withIcon tenMore">
					<BtnText buttonText="8" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="1" customClass="font-digits" onclick={() => {}} />

					<BtnText buttonText="÷" customClass="op-style btn__op " onclick={() => {}} />

					<BtnText customClass="op btn__func" onclick={() => {}} buttonText="&Sqrt;x" />

					<BtnText buttonText="(" customClass="op btn__func constanta" onclick={() => {}} />
					<BtnText buttonText="1" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="0" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="0" customClass="font-digits" onclick={() => {}} />

					<BtnText buttonText=")" customClass="op btn__func constanta" onclick={() => {}} />
					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />

					<FineFraction expr="8(1÷10)" />
				</li>
			</ul>
		</div>
	</div>

	<div class="card" id="StepMode">
		<h2>Step-by-Step Mode</h2>
		<h2>
			<BtnText
				buttonText="steps"
				customClass="op btn__func constanta fractionSwitch  action "
				onclick={() => {}}
			/>
		</h2>
		<div>
			<p>
				You can enable <strong>Step-by-Step</strong> mode to solve complex expressions with fractions.
				Instead of showing only the final answer, the calculator displays every step of the solution.
			</p>
			<p>
				Press <strong class="example crl">steps</strong> to turn the step-by-step solution on or off.
			</p>
			<AccordionDetails castomClass="optionCalc" name="my-accordion">
				{#snippet summary()}
					<h3>Each step explains the mathematical transformation.</h3>
				{/snippet}
				<div>
					<ul>
						<li><strong>Step 1.</strong> The original fraction expression you entered.</li>

						<li><strong>Step 2.</strong> Evaluate any powers and square roots.</li>

						<li>
							<strong>Step 3.</strong> Evaluate any expressions inside parentheses in the numerator and/or
							denominator of each fraction.
						</li>

						<li><strong>Step 4.</strong> Convert all mixed numbers to improper fractions.</li>

						<li>
							<strong>Step 5.</strong> If the expression contains fraction division, replace it with multiplication
							by the reciprocal.
						</li>

						<li>
							<strong>Step 6.</strong> Multiply the fractions by multiplying the numerators and denominators.
						</li>

						<li>
							<strong>Step 7.</strong> If necessary, rewrite all fractions with a common denominator.
						</li>

						<li>
							<strong>Step 8.</strong> Add and subtract the fractions using the common denominator.
						</li>

						<li>
							<strong>Step 9.</strong> Simplify the resulting fraction and convert it to a mixed number
							if possible.
						</li>

						<li><strong>Step 10.</strong> Final answer.</li>
					</ul>
				</div>
			</AccordionDetails>
		</div>

		<div>
			<ul>
				<li class="example">
					<strong>Examples #1 for Step-by-Step mode.</strong>
				</li>
				<li><FineFraction expr=" 3(1÷2) + (4÷5)" /></li>
				<li>Press <strong class="example crl">steps</strong></li>
				<li>Enter into the calculator:</li>
				<li class="withIcon tenMore">
					<BtnText buttonText="3" customClass="font-digits" onclick={() => {}} />

					<BtnText buttonText="(" customClass="op btn__func constanta" onclick={() => {}} />
					<BtnText buttonText="1" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="÷" customClass="op-style btn__op " onclick={() => {}} />
					<BtnText buttonText="2" customClass="font-digits" onclick={() => {}} />

					<BtnText buttonText=")" customClass="op btn__func constanta" onclick={() => {}} />
					<BtnText buttonText="+" customClass="op" onclick={() => {}} />
					<BtnText buttonText="(" customClass="op btn__func constanta" onclick={() => {}} />
					<BtnText buttonText="4" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="÷" customClass="op-style btn__op " onclick={() => {}} />
					<BtnText buttonText="5" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText=")" customClass="op btn__func constanta" onclick={() => {}} />
					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />
				</li>
				<li>
					<ul>
						<li>The calculation history will show the step-by-step solution:</li>
						<li><FineFraction expr=" 3(1÷2) + (4÷5) = " /></li>
						<li><FineFraction expr="(7÷2) + (4÷5) = " /></li>
						<li><FineFraction expr=" 35÷10 + 8÷10 = " /></li>
						<li><FineFraction expr=" (35+8)÷10 = " /></li>
						<li><FineFraction expr=" 4(3÷10)" /></li>
					</ul>
				</li>
			</ul>
		</div>

		<div>
			<ul>
				<li class="example">
					<strong>Examples #2 for Step-by-Step mode.</strong>
				</li>
				<li><FineFraction expr=" 2(2÷3)+7(4÷5)+3*(6÷7)" /></li>
				<li>Press <strong class="example crl">steps</strong></li>
				<li>Enter into the calculator:</li>
				<li class="withIcon tenMore">
					<BtnText buttonText="2" customClass="font-digits" onclick={() => {}} />

					<BtnText buttonText="(" customClass="op btn__func constanta" onclick={() => {}} />
					<BtnText buttonText="2" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="÷" customClass="op-style btn__op " onclick={() => {}} />
					<BtnText buttonText="3" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText=")" customClass="op btn__func constanta" onclick={() => {}} />

					<BtnText buttonText="+" customClass="op" onclick={() => {}} />

					<BtnText buttonText="7" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="(" customClass="op btn__func constanta" onclick={() => {}} />
					<BtnText buttonText="4" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="÷" customClass="op-style btn__op " onclick={() => {}} />
					<BtnText buttonText="5" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText=")" customClass="op btn__func constanta" onclick={() => {}} />

					<BtnText buttonText="+" customClass="op" onclick={() => {}} />

					<BtnText buttonText="3" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="*" customClass="op" onclick={() => {}} />
					<BtnText buttonText="(" customClass="op btn__func constanta" onclick={() => {}} />
					<BtnText buttonText="6" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="÷" customClass="op-style btn__op " onclick={() => {}} />
					<BtnText buttonText="7" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText=")" customClass="op btn__func constanta" onclick={() => {}} />

					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />
				</li>
				<li>
					<ul>
						<li>The calculation history will show the step-by-step solution:</li>
						<li><FineFraction expr=" 8÷3 + 39÷5 + 18÷7 = " /></li>
						<li><FineFraction expr="280÷105 + 819÷105 + 270÷105 = " /></li>
						<li><FineFraction expr=" (280+819+270)÷105 = " /></li>
						<li><FineFraction expr=" 13(4÷105)" /></li>
					</ul>
				</li>
			</ul>
		</div>
	</div>

	<div class="card" id="EvCoExFraction">
		<h2>Evaluate Complex Expressions with Fractions.</h2>
		<div>
			<div class="example">
				<strong>Examples for Complex Expressions with Fractions.</strong>
			</div>
			<ul>
				<li class="example">Example #1</li>
				<li><FineFraction expr=" (18÷4+3÷5) / (14÷35-8÷121)" /></li>
				<li>Enter the expression using the calculator buttons.</li>
				<li class="withIcon">
					Press <BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />
				</li>
				<li>The answer is <FineFraction expr=" 15(111÷404) " /></li>
			</ul>
		</div>

		<div>
			<ul>
				<li class="example">Example #2</li>
				<li><FineFraction expr=" (18*4-12.7+3÷5) / (14*35-121)" /></li>
				<li>Enter the expression using the calculator buttons.</li>
				<li class="withIcon">
					Press <BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />
				</li>
				<li>The answer is <FineFraction expr=" 599÷3690 " /></li>
			</ul>
		</div>
	</div>

	<div class="card" id="AvoidThComMistakesFraction">
		<h2>⚠️ Avoid These Common Mistakes.</h2>
		<div>
			<ul>
				<li class="example">
					5*(1÷4) - This is multiplication, <strong>not</strong> a mixed number. <FineFraction
						expr=" 5*1÷4"
					/>
				</li>
				<li class="example">5(1÷4) - This is a mixed number.<FineFraction expr=" 5(1÷4)" /></li>

				<li>
					Enter mixed numbers as a whole number followed by the fraction in parentheses: <strong
						>5(1÷4)</strong
					>.
				</li>
				<li class="example">
					1÷2÷3÷4÷5 - Left-associative division can produce unexpected results.
				</li>
				<li>💡 Use parentheses in chained division expressions: <strong>((1÷2)÷3)÷4</strong>.</li>
				<li class="example">💡 <strong> Use parentheses to avoid ambiguity.</strong></li>
				<li class="example">
					💡 When multiplying by an expression in parentheses, always use the <strong>*</strong>
					operator explicitly:
				</li>
				<li><strong>2*((3+4)÷5)</strong>.</li>
				<li class="example">💡 Break complex expressions with powers into simpler parts.</li>
				<li class="example">💡 Break complex expressions into simpler parts.</li>
				<li class="example">
					If an error occurs, check that your parentheses are balanced and correctly placed.
				</li>
			</ul>
		</div>

		<h2>Enjoy using the fraction calculator! 🎉</h2>
	</div>
</main>

<style lang="scss">
	@use '../../../../styles/_instructionPages.scss';
	@use '../../../../styles/_variables.scss' as *;

	// .mainInstr  in src/styles/app.scss
	.mainInstr {
		padding-left: 1rem;
	}

	.card {
		&:hover {
			box-shadow: $shadow-inset;
		}
	}

	h2 {
		letter-spacing: 0.2rem;
		margin: 1rem auto;
	}

	strong.answer {
		font-size: 1.6rem;
	}

	strong.example {
		color: $clr-mint;
		font-weight: 400;

		&.crl {
			padding: 0 0.5rem;
			color: $clr-coral;
			font-size: 1.1rem;
		}
	}
</style>
