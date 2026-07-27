<script>
	// @ts-ignore
	import { base } from '$app/paths';
	import BtnText from '$lib/components/Btn/BtnText.svelte';

	// может быть открыт только один <details>
	import { onMount } from 'svelte';
	import { initAccordion } from '$lib/utils/initAccordion';

	onMount(() => {
		// Код внутри onMount никогда не запустится на сервере
		initAccordion(); // аккордеон из нескольких <details> для домашнего каталога
	});
</script>

<header class="header">
	<h1 class="headerSlogan">Basic Calculator</h1>
</header>

<main class="homeTextPage faqPage">
	<div class="card">
		<h2>Introduction</h2>
		<h3>Fast Online Basic Calculator</h3>
		<div>
			<p>
				Use this calculator to perform everyday mathematical calculations quickly and accurately.
			</p>
			<p>
				The calculator supports not only the four basic arithmetic operations but also percentages,
				powers, roots, factorials, mathematical constants, reciprocal calculations, rounding, and
				several additional mathematical functions.
			</p>
			<p>
				It works directly in your browser without installation and is suitable for school, home,
				office, engineering, finance, shopping, budgeting, and everyday calculations.
			</p>
		</div>
	</div>

	<div class="card">
		<h2>Features</h2>
		<div>
			<h3>This calculator includes:</h3>
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
				<li class="withIcon">
					Percent calculations <BtnText
						customClass="op btn__func"
						onclick={() => {}}
						buttonText="%"
					/>
				</li>
				<li class="withIcon">
					Factorial <BtnText customClass="op btn__func" onclick={() => {}} buttonText="x!" />
				</li>
				<li class="withIcon">
					Absolute value <BtnText customClass="op btn__func" onclick={() => {}} buttonText="|x|" />
				</li>
				<li class="withIcon">
					Square <BtnText customClass="op btn__func" onclick={() => {}} buttonText="x^2" />
				</li>
				<li class="withIcon">
					Power <BtnText customClass="op btn__func" onclick={() => {}} buttonText="x^y" />
				</li>
				<li class="withIcon">
					Square root <BtnText customClass="op btn__func" onclick={() => {}} buttonText="&Sqrt;x" />
				</li>
				<li class="withIcon">
					y-th root <BtnText customClass="op btn__func" onclick={() => {}} buttonText="ʸ&Sqrt;x" />
				</li>
				<li class="withIcon">
					Reciprocal <BtnText customClass="op btn__func" onclick={() => {}} buttonText="1/x" />
				</li>
				<li class="withIcon">
					Scientific notation <BtnText
						customClass="op btn__func"
						onclick={() => {}}
						buttonText=" *10^y"
					/>
				</li>
				<li class="withIcon">
					Round X to Y decimal places.
					<BtnText customClass="op btn__func" onclick={() => {}} buttonText="x,y" />
				</li>
				<li class="withIcon">
					Mathematical constants
					<BtnText customClass="op btn__func constanta" onclick={() => {}} buttonText="π" /> and
					<BtnText customClass="op btn__func constanta" onclick={() => {}} buttonText="e" />
				</li>

				<li class="withIcon">
					Decimal rounding <BtnText buttonText="." customClass="btn__op" onclick={() => {}} />
				</li>
				<li class="withIcon">
					Change the sign of a number. <BtnText
						buttonText="+/-"
						customClass="btn__op"
						onclick={() => {}}
					/>
				</li>
			</ul>
		</div>
	</div>

	<div class="card">
		<h2>How to Use. Examples:</h2>
		<div>
			<p></p>
			<ul>
				<li>
					<strong>Addition</strong>
				</li>
				<li>125 + 85 = 210</li>
				<li class="withIcon">
					<BtnText customClass="font-digits" buttonText="1" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="2" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="5" onclick={() => {}} />
					<BtnText customClass="op" onclick={() => {}} buttonText="+" />
					<BtnText customClass="font-digits" buttonText="8" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="5" onclick={() => {}} />
					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />
					<strong class="answer font-digits">210</strong>
				</li>
			</ul>
			<ul>
				<li>
					<strong>Subtraction</strong>
				</li>
				<li>400 − 175 = 225</li>
				<li class="withIcon">
					<BtnText customClass="font-digits" buttonText="4" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="0" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="0" onclick={() => {}} />
					<BtnText customClass="op" onclick={() => {}} buttonText="-" />
					<BtnText customClass="font-digits" buttonText="1" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="7" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="5" onclick={() => {}} />
					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />
					<strong class="answer font-digits">225</strong>
				</li>
			</ul>
			<ul>
				<li>
					<strong>Multiplication</strong>
				</li>
				<li>25 * 12 = 300</li>
				<li class="withIcon">
					<BtnText customClass="font-digits" buttonText="2" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="5" onclick={() => {}} />
					<BtnText customClass="op" onclick={() => {}} buttonText="*" />
					<BtnText customClass="font-digits" buttonText="1" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="2" onclick={() => {}} />
					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />
					<strong class="answer font-digits">300</strong>
				</li>
			</ul>
			<ul>
				<li>
					<strong>Division</strong>
				</li>
				<li>144 / 12 = 12</li>
				<li class="withIcon">
					<BtnText customClass="font-digits" buttonText="1" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="4" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="4" onclick={() => {}} />
					<BtnText customClass="op" onclick={() => {}} buttonText="/" />
					<BtnText customClass="font-digits" buttonText="1" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="2" onclick={() => {}} />
					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />
					<strong class="answer font-digits">12</strong>
				</li>
			</ul>
			<ul>
				<li>
					<strong>Percentage of a Number</strong>
				</li>
				<li>150 * 20% = (150 * 0.2) = 30</li>
				<li class="withIcon">
					<BtnText customClass="font-digits" buttonText="1" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="5" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="0" onclick={() => {}} />
					<BtnText customClass="op" onclick={() => {}} buttonText="*" />
					<BtnText customClass="font-digits" buttonText="2" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="0" onclick={() => {}} />
					<BtnText customClass="op btn__func" onclick={() => {}} buttonText="%" />
					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />
					<strong class="answer font-digits">30</strong>
				</li>
				<li>
					<strong>Subtract a Percentage. Percentage Decrease.</strong>
				</li>
				<li>150 − 20% = 150 − (150 * 20%) = 150 - 30 = 120</li>
				<li class="withIcon">
					<BtnText customClass="font-digits" buttonText="1" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="5" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="0" onclick={() => {}} />
					<BtnText customClass="op" onclick={() => {}} buttonText="-" />
					<BtnText customClass="font-digits" buttonText="2" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="0" onclick={() => {}} />
					<BtnText customClass="op btn__func" onclick={() => {}} buttonText="%" />
					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />
					<strong class="answer font-digits">120</strong>
				</li>
				<li>
					<strong>Add a Percentage. Percentage Increase.</strong>
				</li>
				<li>Increase 150 by 20%</li>
				<li>150 + 20% = 150 + (150 * 20%) = 150 + 30 = 180</li>
				<li class="withIcon">
					<BtnText customClass="font-digits" buttonText="1" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="5" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="0" onclick={() => {}} />
					<BtnText customClass="op" onclick={() => {}} buttonText="+" />
					<BtnText customClass="font-digits" buttonText="2" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="0" onclick={() => {}} />
					<BtnText customClass="op btn__func" onclick={() => {}} buttonText="%" />
					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />
					<strong class="answer font-digits">180</strong>
				</li>
				<li>
					<strong> Divide by a Percentage</strong>
				</li>
				<li>150 / 20% = 150 / 0.2 = 750</li>
				<li class="withIcon">
					<BtnText customClass="font-digits" buttonText="1" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="5" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="0" onclick={() => {}} />
					<BtnText customClass="op" onclick={() => {}} buttonText="/" />
					<BtnText customClass="font-digits" buttonText="2" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="0" onclick={() => {}} />
					<BtnText customClass="op btn__func" onclick={() => {}} buttonText="%" />
					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />
					<strong class="answer font-digits">750</strong>
				</li>
				<li>
					<strong> What Percentage Is One Number of Another?</strong>
				</li>
				<li>30 is what percent of 150?</li>
				<li>100 * 30 / 150 = 20</li>
				<li>
					<strong> Reverse Percentage</strong>
				</li>
				<li>120 is 80% of what number?</li>
				<li>100 * 120 / 80 = 150</li>
				<li>
					<strong>Find the Original Price Before a Discount</strong>
				</li>
				<li>
					After a 20% discount, the price is 150. What was the original price? Answer: 187.50.
				</li>
				<li>150 is 80% of the original price.</li>
				<li>150 ÷ 80% = 187.50</li>
				<li>
					<strong>Find the Original Price Before a Discount</strong>
				</li>
				<li>The price after a 15% discount is 180. What was the original price? Answer: 211.76.</li>
				<li>180 is 85% of the original price.</li>
				<li>180 ÷ 85% = 211.76</li>
			</ul>
			<ul>
				<li>
					<strong>Power</strong>
				</li>
				<li>5² = 25</li>
				<li class="withIcon">
					<BtnText customClass="font-digits" buttonText="7" onclick={() => {}} />
					<BtnText customClass="op btn__func" onclick={() => {}} buttonText="x^2" />
					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />
					<strong class="answer font-digits">49</strong>
				</li>
				<li>2⁸ = 256</li>
				<li class="withIcon">
					<BtnText customClass="font-digits" buttonText="2" onclick={() => {}} />
					<BtnText customClass="op btn__func" onclick={() => {}} buttonText="x^y" />
					<BtnText customClass="font-digits" buttonText="8" onclick={() => {}} />
					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />
					<strong class="answer font-digits">256</strong>
				</li>
			</ul>
			<ul>
				<li>
					<strong>Square Root</strong>
				</li>
				<li>√64 = 8</li>
				<li class="withIcon">
					<BtnText customClass="op btn__func" onclick={() => {}} buttonText="&Sqrt;x" />
					<BtnText customClass="font-digits" buttonText="6" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="4" onclick={() => {}} />
					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />
					<strong class="answer font-digits">8</strong>
				</li>
				<li>√(100+44) = 12</li>
				<li class="withIcon">
					<BtnText customClass="op btn__func" onclick={() => {}} buttonText="&Sqrt;x" />
					<BtnText customClass="font-digits" buttonText="1" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="0" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="0" onclick={() => {}} />
					<BtnText customClass="op" onclick={() => {}} buttonText="+" />
					<BtnText customClass="font-digits" buttonText="4" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="4" onclick={() => {}} />
					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />
					<strong class="answer font-digits">12</strong>
				</li>
			</ul>
			<ul>
				<li>
					<strong>y-th root </strong>
				</li>
				<li>⁴√81 = 3</li>
				<li class="withIcon">
					<BtnText customClass="font-digits" buttonText="8" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="1" onclick={() => {}} />
					<BtnText customClass="op btn__func" onclick={() => {}} buttonText="ʸ&Sqrt;x" />
					<BtnText customClass="font-digits" buttonText="4" onclick={() => {}} />
					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />
					<strong class="answer font-digits">3</strong>
				</li>
			</ul>
			<ul>
				<li>
					<strong>Reciprocal</strong>
				</li>
				<li>1 / 8 = 0.125</li>
				<li class="withIcon">
					<BtnText customClass="font-digits" buttonText="8" onclick={() => {}} />
					<BtnText customClass="op btn__func" onclick={() => {}} buttonText="1/x" />
					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />
					<strong class="answer font-digits">0.125</strong>
				</li>
			</ul>
			<ul>
				<li>
					<strong>Factorial</strong>
				</li>
				<li>6! = 720</li>
				<li class="withIcon">
					<BtnText customClass="font-digits" buttonText="6" onclick={() => {}} />
					<BtnText customClass="op btn__func" onclick={() => {}} buttonText="x!" />
					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />
					<strong class="answer font-digits">720</strong>
				</li>
			</ul>
			<ul>
				<li>
					<strong>Round X to Y decimal places.</strong>
				</li>
				<li class="withIcon">
					<BtnText customClass="op btn__func constanta" onclick={() => {}} buttonText="π" />
					<BtnText customClass="op btn__func" onclick={() => {}} buttonText="x,y" />
					<BtnText customClass="font-digits" buttonText="3" onclick={() => {}} />
					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />
					<strong class="answer font-digits">3.141</strong>
				</li>
			</ul>
			<ul>
				<li>
					<strong>Absolute value.</strong>
				</li>
				<li class="withIcon">
					<strong class="answer font-digits">-20.7</strong>
					<BtnText customClass="op btn__func" onclick={() => {}} buttonText="|x|" />
					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />
					<strong class="answer font-digits">20.7</strong>
				</li>
			</ul>
			<ul>
				<li>
					<strong>Scientific notation.</strong>
				</li>
				<li class="withIcon">
					<BtnText customClass="op btn__func constanta" onclick={() => {}} buttonText="e" />
					<BtnText customClass="op btn__func" onclick={() => {}} buttonText=" *10^y" />
					<BtnText customClass="font-digits" buttonText="8" onclick={() => {}} />
					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />
					<strong class="answer font-digits">271828000</strong>
				</li>
			</ul>
			<ul>
				<li>
					<strong>More Complex Calculations</strong>
				</li>
				<li>2+2*2 = 6</li>
				<li class="withIcon">
					<BtnText customClass="font-digits" buttonText="2" onclick={() => {}} />
					<BtnText customClass="op" onclick={() => {}} buttonText="+" />
					<BtnText customClass="font-digits" buttonText="2" onclick={() => {}} />
					<BtnText customClass="op" onclick={() => {}} buttonText="*" />
					<BtnText customClass="font-digits" buttonText="2" onclick={() => {}} />
					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />
					<strong class="answer font-digits">6</strong>
				</li>
				<li>
					<strong>Multi-Step Calculations</strong>
				</li>
				<li>1/2/3/4 = 0.04167</li>
				<li class="withIcon">
					<BtnText customClass="font-digits" buttonText="1" onclick={() => {}} />
					<BtnText customClass="op" onclick={() => {}} buttonText="/" />
					<BtnText customClass="font-digits" buttonText="2" onclick={() => {}} />
					<BtnText customClass="op" onclick={() => {}} buttonText="/" />
					<BtnText customClass="font-digits" buttonText="3" onclick={() => {}} />
					<BtnText customClass="op" onclick={() => {}} buttonText="/" />
					<BtnText customClass="font-digits" buttonText="4" onclick={() => {}} />
					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />
					<strong class="answer font-digits">0.04167</strong>
				</li>
			</ul>
		</div>
	</div>

	<div class="card">
		<h2>Mathematical Constants</h2>
		<div>
			<p>The calculator provides quick access to two commonly used mathematical constants.</p>
			<ul>
				<li><strong>π (Pi)</strong></li>
				<li>Approximately:</li>
				<li>3.141592653589793...</li>
				<li>Used for circles, geometry, engineering and physics.</li>
			</ul>
			<ul>
				<li><strong>e (Euler's Number)</strong></li>
				<li>Approximately:</li>
				<li>2.718281828459045...</li>
				<li>Used in exponential growth, logarithms, finance and science.</li>
			</ul>
		</div>
	</div>
</main>

<style lang="scss">
	.card {
		width: fit-content;
		margin: 0 auto;
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
	strong.answer {
		font-size: 3rem;
		font-weight: 600;
	}
</style>
