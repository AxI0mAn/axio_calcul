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

	// плавное открытие  и мгновенное закрытие <details>
	import AccordionDetails from '$lib/components/aBlock/AccordionDetails.svelte';
</script>

<!-- <AccordionDetails castomClass="optionCalc" name="my-accordion">
  {#snippet summary()} 
  {/snippet}
 
</AccordionDetails> -->

<header class="header">
	<h1 class="headerSlogan" id="instructionEngineer">Engineering Calculator</h1>
</header>

<main class="homeTextPage calcInstrPage">
	<ul class="mainInstr">
		<h2>Contents:</h2>
		<li>
			<a class="learnMore_goTo" href="{base}/engineer/#IntroductionEngineer">
				<h3>Introduction.</h3></a
			>
		</li>

		<li>
			<a class="learnMore_goTo" href="{base}/engineer/#FeaturesEngineer"> <h3>Features.</h3></a>
		</li>

		<li>
			<a class="learnMore_goTo" href="{base}/engineer/#ExamplesEngineer"> <h3>How to Use.</h3></a>
		</li>

		<li>
			<a class="learnMore_goTo" href="{base}/engineer#ConstantsEngineer">
				<h3>Mathematical Constants.</h3></a
			>
		</li>

		<li>
			<a class="learnMore_goTo" href="{base}/engineer/#instructionEngineerExamples">
				<h3>More than 12 real-world calculation examples.</h3></a
			>
		</li>

		<li>
			<a class="learnMore_goTo" href="{base}/engineer/#mainInstr">
				<h3>Lern more about Interface.</h3></a
			>
		</li>
	</ul>

	<div class="card" id="IntroductionEngineer">
		<h2>Introduction</h2>
		<h3>Advanced Scientific and Engineering Calculator</h3>
		<div>
			<p>
				The Engineering Calculator is designed for advanced mathematical calculations used in
				education, engineering, science, software development, finance, and everyday technical work.
			</p>
			<p>
				In addition to basic arithmetic, it supports powers, roots, logarithms, mathematical
				constants, prime factorization, divisor calculations, factorials, percentages, random number
				generation, and many other scientific functions.
			</p>
			<p>
				The calculator runs entirely in your browser, works on desktop and mobile devices, and can
				also be installed as a Progressive Web App for convenient offline use.
			</p>
		</div>
	</div>

	<div class="card" id="FeaturesEngineer">
		<h2>Features</h2>
		<p>The calculator includes the following functions:</p>

		<AccordionDetails castomClass="optionCalc" name="my-accordion">
			{#snippet summary()}
				<h3>Arithmetic</h3>
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
					<li class="withIcon">
						Parentheses for complex expressions <BtnText
							customClass="op btn__func constanta"
							onclick={() => {}}
							buttonText="("
						/>
						<BtnText customClass="op btn__func constanta" onclick={() => {}} buttonText=")" />
					</li>
				</ul>
			</div>
		</AccordionDetails>

		<AccordionDetails castomClass="optionCalc" name="my-accordion">
			{#snippet summary()}
				<h3>Powers and Roots</h3>
			{/snippet}
			<div>
				<ul>
					<li class="withIcon">
						Square <BtnText buttonText="x^2" customClass="op btn__func" onclick={() => {}} />
					</li>
					<li class="withIcon">
						Cube <BtnText buttonText="x^3" customClass="op btn__func" onclick={() => {}} />
					</li>
					<li class="withIcon">
						Exponential <BtnText buttonText="e^x" customClass="op btn__func" onclick={() => {}} />
					</li>
					<li class="withIcon">
						Power <BtnText buttonText="x^y" customClass="op btn__func" onclick={() => {}} />
					</li>
					<li class="withIcon">
						Scientific notation <BtnText
							customClass="op btn__func"
							onclick={() => {}}
							buttonText="*10^y"
						/>
					</li>
					<li class="withIcon">
						y-th root <BtnText
							customClass="op btn__func"
							onclick={() => {}}
							buttonText="ʸ&Sqrt;x"
						/>
					</li>
					<li class="withIcon">
						Square root <BtnText
							customClass="op btn__func"
							onclick={() => {}}
							buttonText="&Sqrt;x"
						/>
					</li>
				</ul>
			</div>
		</AccordionDetails>

		<AccordionDetails castomClass="optionCalc" name="my-accordion">
			{#snippet summary()}
				<h3>Logarithms</h3>
			{/snippet}
			<div>
				<ul>
					<li class="withIcon">
						Natural Logarithm <BtnText
							customClass="op btn__func"
							onclick={() => {}}
							buttonText="ln(x)"
						/>
					</li>
					<li class="withIcon">
						Common Logarithm (log₁₀ or lg) <BtnText
							customClass="op btn__func"
							onclick={() => {}}
							buttonText="lg(x)"
						/>
					</li>
					<li class="withIcon">
						Base-2 Logarithm <BtnText
							customClass="op btn__func"
							onclick={() => {}}
							buttonText="log2(x)"
						/>
					</li>
					<li class="withIcon">
						Logarithm with Any Base <BtnText
							customClass="op btn__func"
							onclick={() => {}}
							buttonText="logY(x)"
						/>
					</li>
				</ul>
			</div>
		</AccordionDetails>

		<AccordionDetails castomClass="optionCalc" name="my-accordion">
			{#snippet summary()}
				<h3>Mathematical Constants</h3>
			{/snippet}
			<div>
				<ul>
					<li class="withIcon">
						Pi (π) <BtnText
							customClass="op btn__func constanta"
							onclick={() => {}}
							buttonText="π"
						/>
					</li>
					<li class="withIcon">
						Euler's Number (e) <BtnText
							customClass="op btn__func constanta"
							onclick={() => {}}
							buttonText="e"
						/>
					</li>
					<li class="withIcon">
						Golden Ratio (φ) <BtnText
							customClass="op btn__func constanta"
							onclick={() => {}}
							buttonText="φ"
						/>
					</li>
					<li class="withIcon">
						Square Root of 2 (√2) <BtnText
							customClass="op btn__func constanta"
							onclick={() => {}}
							buttonText="√2"
						/>
					</li>
					<li class="withIcon">
						Natural Logarithm of 2 (ln 2) <BtnText
							customClass="op btn__func constanta"
							onclick={() => {}}
							buttonText="ln2"
						/>
					</li>
					<li class="withIcon">
						Natural Logarithm of 10 (ln 10) <BtnText
							customClass="op btn__func constanta"
							onclick={() => {}}
							buttonText="ln10"
						/>
					</li>
				</ul>
			</div>
		</AccordionDetails>

		<AccordionDetails castomClass="optionCalc" name="my-accordion">
			{#snippet summary()}
				<h3>Number Functions</h3>
			{/snippet}
			<div>
				<ul>
					<li class="withIcon">
						Factorial <BtnText customClass="op btn__func" onclick={() => {}} buttonText="x!" />
					</li>
					<li class="withIcon">
						Absolute Value <BtnText
							customClass="op btn__func"
							onclick={() => {}}
							buttonText="|x|"
						/>
					</li>
					<li class="withIcon">
						Reciprocal (1/x) <BtnText
							customClass="op btn__func"
							onclick={() => {}}
							buttonText="1/x"
						/>
					</li>
					<li class="withIcon">
						Round to a Specified Number of Decimal Places <BtnText
							customClass="op btn__func"
							onclick={() => {}}
							buttonText="x,y"
						/>
					</li>
					<li class="withIcon">
						Generate a Random Number Greater Than Zero (RAND) <BtnText
							customClass="op btn__func constanta"
							onclick={() => {}}
							buttonText="RAND"
						/>
					</li>
					<li class="withIcon">
						Calculate Percentages <BtnText
							customClass="op btn__func"
							onclick={() => {}}
							buttonText="%"
						/>
					</li>
				</ul>
			</div>
		</AccordionDetails>

		<AccordionDetails castomClass="optionCalc" name="my-accordion">
			{#snippet summary()}
				<h3>Number Theory</h3>
			{/snippet}
			<div>
				<ul>
					<li class="withIcon">
						Prime Factorization <BtnText
							customClass="op btn__func"
							onclick={() => {}}
							buttonText="x=A*B"
						/>
					</li>
					<li class="withIcon">
						Find the Common Divisors of Two Numbers <BtnText
							customClass="op btn__func"
							onclick={() => {}}
							buttonText="divs:X∩Y"
						/>
					</li>
				</ul>
			</div>
		</AccordionDetails>
	</div>

	<div class="card" id="ExamplesEngineer">
		<h2>How to Use. Examples:</h2>
		<div>
			<a class="learnMore_goTo" href="{base}/basic#ExamplesBasic">
				View arithmetic examples on the Basic Calculator page.
			</a>
			<ul>
				<li class="example">
					<strong>Powers</strong>
				</li>
				<li>2^10 = 1024</li>
				<li class="withIcon">
					<BtnText customClass="font-digits" buttonText="2" onclick={() => {}} />
					<BtnText customClass="op btn__func" onclick={() => {}} buttonText="x^y" />
					<BtnText customClass="font-digits" buttonText="1" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="0" onclick={() => {}} />
					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />
					<strong class="answer font-digits">1024</strong>
				</li>
				<li>5^3 = 125</li>
				<li class="withIcon">
					<BtnText customClass="font-digits" buttonText="5" onclick={() => {}} />
					<BtnText customClass="op btn__func" onclick={() => {}} buttonText="x^y" />
					<BtnText customClass="font-digits" buttonText="3" onclick={() => {}} />
					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />
					<strong class="answer font-digits">125</strong>
				</li>
			</ul>

			<ul>
				<li class="example">
					<strong>Cube</strong>
				</li>
				<li>(3+4)^3 = 125</li>
				<li class="withIcon">
					<BtnText customClass="op btn__func constanta" onclick={() => {}} buttonText="(" />
					<BtnText customClass="font-digits" buttonText="3" onclick={() => {}} />
					<BtnText customClass="op" onclick={() => {}} buttonText="+" />
					<BtnText customClass="font-digits" buttonText="4" onclick={() => {}} />
					<BtnText customClass="op btn__func constanta" onclick={() => {}} buttonText=")" />
					<BtnText customClass="op btn__func" onclick={() => {}} buttonText="x^3" />
					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />
					<strong class="answer font-digits">343</strong>
				</li>
			</ul>

			<ul>
				<li class="example">
					<strong>Square Root</strong>
				</li>
				<li>√225 = 15</li>
				<li class="withIcon">
					<BtnText customClass="op btn__func" onclick={() => {}} buttonText="&Sqrt;x" />
					<BtnText customClass="font-digits" buttonText="2" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="2" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="5" onclick={() => {}} />
					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />
					<strong class="answer font-digits">15</strong>
				</li>
				<li>√(152-31) = 11</li>
				<li class="withIcon">
					<BtnText customClass="op btn__func" onclick={() => {}} buttonText="&Sqrt;x" />
					<BtnText customClass="font-digits" buttonText="1" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="5" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="2" onclick={() => {}} />
					<BtnText customClass="op" onclick={() => {}} buttonText="−" />
					<BtnText customClass="font-digits" buttonText="3" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="1" onclick={() => {}} />
					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />
					<strong class="answer font-digits">11</strong>
				</li>
			</ul>

			<ul>
				<li class="example">
					<strong>Natural Logarithm</strong>
				</li>
				<li>ln(e) = 1</li>
				<li class="withIcon">
					<BtnText customClass="op btn__func constanta" onclick={() => {}} buttonText="e" />
					<BtnText customClass="op btn__func" onclick={() => {}} buttonText="ln(x)" />
					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />
					<strong class="answer font-digits">1</strong>
				</li>
			</ul>

			<ul>
				<li class="example">
					<strong>Common Logarithm</strong>
				</li>
				<li>lg(1000) = 3</li>
				<li class="withIcon">
					<BtnText customClass="font-digits" buttonText="1" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="0" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="0" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="0" onclick={() => {}} />
					<BtnText customClass="op btn__func" onclick={() => {}} buttonText="lg(x)" />
					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />
					<strong class="answer font-digits">3</strong>
				</li>
			</ul>

			<ul>
				<li class="example">
					<strong>Binary Logarithm</strong>
				</li>
				<li>log₂(1024) = 10</li>
				<li class="withIcon">
					<BtnText customClass="font-digits" buttonText="1" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="0" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="2" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="4" onclick={() => {}} />
					<BtnText customClass="op btn__func" onclick={() => {}} buttonText="log2(x)" />
					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />
					<strong class="answer font-digits">10</strong>
				</li>
			</ul>

			<ul>
				<li class="example">
					<strong>Arbitrary Base Logarithm</strong>
				</li>
				<li>log₃(81) = 4</li>
				<li class="withIcon">
					<BtnText customClass="font-digits" buttonText="8" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="1" onclick={() => {}} />
					<BtnText customClass="op btn__func" onclick={() => {}} buttonText="logY(x)" />
					<BtnText customClass="font-digits" buttonText="3" onclick={() => {}} />
					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />
					<strong class="answer font-digits">4</strong>
				</li>
			</ul>

			<ul>
				<li class="example">
					<strong>Factorial</strong>
				</li>
				<li>8! = 40320</li>
				<li class="withIcon">
					<BtnText customClass="font-digits" buttonText="8" onclick={() => {}} />
					<BtnText customClass="op btn__func" onclick={() => {}} buttonText="x!" />
					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />
					<strong class="answer font-digits">40320</strong>
				</li>
			</ul>

			<ul>
				<li class="example">
					<strong>Reciprocal</strong>
				</li>
				<li>1/16 = 0.0625</li>
				<li class="withIcon">
					<BtnText customClass="font-digits" buttonText="1" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="6" onclick={() => {}} />
					<BtnText customClass="op btn__func" onclick={() => {}} buttonText="1/x" />
					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />
					<strong class="answer font-digits">0.0625</strong>
				</li>
				<li>1/16 = 0.0625</li>
				<li class="withIcon">
					<BtnText customClass="font-digits" buttonText="1" onclick={() => {}} />
					<BtnText customClass="op" onclick={() => {}} buttonText="/" />
					<BtnText customClass="font-digits" buttonText="1" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="6" onclick={() => {}} />
					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />
					<strong class="answer font-digits">0.0625</strong>
				</li>
			</ul>

			<ul>
				<li class="example">
					<strong>Round to a Specified Number of Decimal Places </strong>
				</li>
				<li>Round π (Pi) to 5 decimal places.</li>
				<li class="withIcon">
					<BtnText customClass="op btn__func constanta" onclick={() => {}} buttonText="π" />
					<BtnText customClass="op btn__func" onclick={() => {}} buttonText="x,y" />

					<BtnText customClass="font-digits" buttonText="5" onclick={() => {}} />
					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />
					<strong class="answer font-digits">3.14159</strong>
				</li>
			</ul>

			<ul>
				<li class="example">
					<strong>Prime Factorization</strong>
				</li>
				<li>360 = 2 * 2 * 2 * 3 * 3 * 5</li>
				<li class="withIcon">
					<BtnText customClass="font-digits" buttonText="3" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="6" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="0" onclick={() => {}} />
					<BtnText customClass="op btn__func" onclick={() => {}} buttonText="x=A*B" />
					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />

					<strong class="answer font-digits">2*2*2*3*3*5</strong>
				</li>
			</ul>

			<ul>
				<li class="example">
					<strong>Common Divisors</strong>
				</li>
				<li>48 and 72</li>
				<li>Common divisors:</li>
				<li>1, 2, 3, 4, 6, 8, 12, 24</li>
				<li class="withIcon">
					<BtnText customClass="font-digits" buttonText="4" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="8" onclick={() => {}} />
					<BtnText customClass="op btn__func" onclick={() => {}} buttonText="divs:X∩Y" />
					<BtnText customClass="font-digits" buttonText="7" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="2" onclick={() => {}} />
					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />
				</li>
				<li>
					<strong class="answer tenMore font-digits">48 ∩ 72 :[1, 2, 3, 4, 6, 8, 12, 24]</strong>
				</li>
			</ul>

			<ul>
				<li class="example">
					<strong>Generate a Random Number Greater Than Zero</strong>
				</li>
				<li>Generate a Random Number between 0 and 1</li>
				<li class="withIcon">
					<BtnText customClass="font-digits" buttonText="0" onclick={() => {}} />
					<BtnText customClass="op btn__func constanta" onclick={() => {}} buttonText="RAND" />
					<BtnText customClass="font-digits" buttonText="1" onclick={() => {}} />
					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />
					<strong class="answer font-digits">0.140114</strong>
				</li>
				<li>
					The number of decimal places is set in <a href="{base}/settings"
						><strong>Settings</strong>.</a
					>
				</li>

				<li>Generate a Random Number between 33 and 1023</li>
				<li class="withIcon">
					<BtnText customClass="font-digits" buttonText="3" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="3" onclick={() => {}} />
					<BtnText customClass="op btn__func constanta" onclick={() => {}} buttonText="RAND" />
					<BtnText customClass="font-digits" buttonText="1" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="0" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="2" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="3" onclick={() => {}} />
					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />
					<strong class="answer font-digits">789</strong>
				</li>
			</ul>
		</div>
	</div>

	<div class="card" id="ConstantsEngineer">
		<h2>Mathematical Constants</h2>
		<div>
			<p>The calculator provides quick access to several widely used mathematical constants.</p>
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
			<ul>
				<li><strong>φ (Golden Ratio)</strong></li>
				<li>Approximately:</li>
				<li>1.618033988749895...</li>
				<li>Frequently appears in geometry, architecture, art, and design.</li>
			</ul>
			<ul>
				<li><strong> √2</strong></li>
				<li>Approximately:</li>
				<li>1.414213562373095...</li>
				<li>The square root of two is commonly used in geometry and engineering.</li>
			</ul>
			<ul>
				<li><strong>ln10</strong></li>
				<li>Approximately:</li>
				<li>2.302585092994...</li>
			</ul>
			<ul>
				<li><strong>ln2</strong></li>
				<li>Approximately:</li>
				<li>0.69314718056...</li>
			</ul>
		</div>
	</div>

	<h2>Calculate in one line!</h2>

	<div class="card" id="instructionEngineerExamples">
		<ul>
			<li class="example">
				<h2>Circumference of a Circle</h2>
			</li>
			<li>
				<strong class="example">C = 2 × π × R or C = π × D</strong>
			</li>
			<li>(where R is the radius and D is the diameter)</li>
			<li>
				Why: Calculate how much landscape edging is needed for a circular flower bed or how much
				fabric is required to cover a round table.
			</li>
			<li>
				Calculate an example for the US: A circular flower bed has a radius of 6 ft. How much edging
				is needed?
			</li>
			<li>Enter into the calculator:</li>
			<li class="withIcon">
				<BtnText customClass="font-digits" buttonText="2" onclick={() => {}} />
				<BtnText customClass="op" onclick={() => {}} buttonText="*" />
				<BtnText customClass="op btn__func constanta" onclick={() => {}} buttonText="π" />
				<BtnText customClass="op" onclick={() => {}} buttonText="*" />
				<BtnText customClass="font-digits" buttonText="6" onclick={() => {}} />
				<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />
				<strong class="answer font-digits">37.70</strong>
			</li>
			<li>Answer:<strong class="example font-digits">37.70 ft</strong></li>
			<li>
				Calculate an example for the EU: A circular flower bed has a radius of 2 m. How much edging
				is needed?
			</li>
			<li>Enter into the calculator:</li>
			<li class="withIcon">
				<BtnText customClass="font-digits" buttonText="2" onclick={() => {}} />
				<BtnText customClass="op" onclick={() => {}} buttonText="*" />
				<BtnText customClass="op btn__func constanta" onclick={() => {}} buttonText="π" />
				<BtnText customClass="op" onclick={() => {}} buttonText="*" />
				<BtnText customClass="font-digits" buttonText="2" onclick={() => {}} />
				<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />
				<strong class="answer font-digits">12.57</strong>
			</li>
			<li>Answer:<strong class="example font-digits">12.57 m</strong></li>
		</ul>
	</div>

	<div class="card" id="AreaCircle">
		<ul>
			<li class="example">
				<h2>Area of a Circle</h2>
			</li>
			<li>
				<strong class="example">S = π × R²</strong>
			</li>
			<li>Why: Calculate the area of a circular lawn, swimming pool, or pizza to compare sizes.</li>
			<li>
				Calculate an example for the US: A round patio has a radius of 10 ft. What is its area?
			</li>
			<li>Enter into the calculator:</li>
			<li class="withIcon">
				<BtnText customClass="op btn__func constanta" onclick={() => {}} buttonText="π" />
				<BtnText customClass="op" onclick={() => {}} buttonText="*" />
				<BtnText customClass="font-digits" buttonText="1" onclick={() => {}} />
				<BtnText customClass="font-digits" buttonText="0" onclick={() => {}} />
				<BtnText buttonText="x^2" customClass="op btn__func" onclick={() => {}} />
				<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />
				<strong class="answer font-digits">314.16</strong>
			</li>
			<li>Answer:<strong class="example font-digits">314.16 ft²</strong></li>
			<li>
				Calculate an example for the EU: A round swimming pool has a radius of 3 m. What is its
				area?
			</li>
			<li>Enter into the calculator:</li>
			<li class="withIcon">
				<BtnText customClass="op btn__func constanta" onclick={() => {}} buttonText="π" />
				<BtnText customClass="op" onclick={() => {}} buttonText="*" />
				<BtnText customClass="font-digits" buttonText="3" onclick={() => {}} />
				<BtnText buttonText="x^2" customClass="op btn__func" onclick={() => {}} />
				<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />
				<strong class="answer font-digits">28.27</strong>
			</li>
			<li>Answer:<strong class="example font-digits">28.27 m²</strong></li>
		</ul>
	</div>

	<div class="card" id="AreaRectangle">
		<ul>
			<li class="example">
				<h2>Area of a Rectangle (or Square)</h2>
			</li>
			<li>
				<strong class="example">S = a × b</strong>
			</li>
			<li>(For a square: S = a²)</li>
			<li>
				Why: Calculate the floor area for laminate flooring, the wall area for wallpaper, or the
				size of a garden bed.
			</li>
			<li>
				Calculate an example for the US: A room measures 14 ft by 12 ft. What is the floor area?
			</li>
			<li>Enter into the calculator:</li>
			<li class="withIcon">
				<BtnText customClass="font-digits" buttonText="1" onclick={() => {}} />
				<BtnText customClass="font-digits" buttonText="4" onclick={() => {}} />
				<BtnText customClass="op" onclick={() => {}} buttonText="*" />
				<BtnText customClass="font-digits" buttonText="1" onclick={() => {}} />
				<BtnText customClass="font-digits" buttonText="2" onclick={() => {}} />
				<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />
				<strong class="answer font-digits">168</strong>
			</li>
			<li>Answer:<strong class="example font-digits">168 ft²</strong></li>
			<li>Calculate an example for the EU: A room measures 5 m by 4 m. What is the floor area?</li>
			<li>Enter into the calculator:</li>
			<li class="withIcon">
				<BtnText customClass="font-digits" buttonText="5" onclick={() => {}} />
				<BtnText customClass="op" onclick={() => {}} buttonText="*" />
				<BtnText customClass="font-digits" buttonText="4" onclick={() => {}} />
				<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />
				<strong class="answer font-digits">20</strong>
			</li>
			<li>Answer:<strong class="example font-digits">20 m²</strong></li>
		</ul>
	</div>

	<div class="card" id="PerimeterRectangle">
		<ul>
			<li class="example">
				<h2>Perimeter of a Rectangle (or Square)</h2>
			</li>
			<li>
				<strong class="example">P = 2 × (a + b)</strong>
			</li>
			<li>(For a square: P = 4 × a)</li>
			<li>
				Why: Calculate how much baseboard, fencing, or string lights are needed around the perimeter
				of a room or yard.
			</li>
			<li>
				Calculate an example for the US: A room measures 16 ft by 12 ft. How much baseboard is
				needed?
			</li>
			<li>Enter into the calculator:</li>
			<li class="withIcon">
				<BtnText customClass="font-digits" buttonText="2" onclick={() => {}} />
				<BtnText customClass="op" onclick={() => {}} buttonText="*" />
				<BtnText customClass="op btn__func constanta" onclick={() => {}} buttonText="(" />
				<BtnText customClass="font-digits" buttonText="1" onclick={() => {}} />
				<BtnText customClass="font-digits" buttonText="6" onclick={() => {}} />
				<BtnText customClass="op" onclick={() => {}} buttonText="+" />
				<BtnText customClass="font-digits" buttonText="1" onclick={() => {}} />
				<BtnText customClass="font-digits" buttonText="2" onclick={() => {}} />
				<BtnText customClass="op btn__func constanta" onclick={() => {}} buttonText=")" />
				<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />
				<strong class="answer font-digits">56</strong>
			</li>
			<li>Answer:<strong class="example font-digits">56 ft</strong></li>
			<li>
				Calculate an example for the EU: A room measures 5 m by 4 m. How much baseboard is needed?
			</li>
			<li>Enter into the calculator:</li>
			<li class="withIcon">
				<BtnText customClass="font-digits" buttonText="2" onclick={() => {}} />
				<BtnText customClass="op" onclick={() => {}} buttonText="*" />
				<BtnText customClass="op btn__func constanta" onclick={() => {}} buttonText="(" />
				<BtnText customClass="font-digits" buttonText="5" onclick={() => {}} />
				<BtnText customClass="op" onclick={() => {}} buttonText="+" />
				<BtnText customClass="font-digits" buttonText="4" onclick={() => {}} />
				<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />
				<strong class="answer font-digits">18</strong>
			</li>
			<li>Answer:<strong class="example font-digits">18 m</strong></li>
		</ul>
	</div>

	<div class="card" id="AreaTriangle">
		<ul>
			<li class="example">
				<h2>Area of a Triangle</h2>
			</li>
			<li>
				<strong class="example">S = (a × h) / 2</strong>
			</li>
			<li>(where a is the base and h is the perpendicular height)</li>
			<li>
				Why: Calculate the area of a roof gable, a triangular flower bed, or a piece of fabric.
			</li>
			<li>
				Calculate an example for the US: A roof gable has a base of 24 ft and a height of 8 ft. What
				is its area?
			</li>
			<li>Enter into the calculator:</li>
			<li class="withIcon">
				<BtnText buttonText="(" customClass="op btn__func constanta" onclick={() => {}} />
				<BtnText buttonText="2" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="4" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="*" customClass="op" onclick={() => {}} />
				<BtnText buttonText="8" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText=")" customClass="op btn__func constanta" onclick={() => {}} />
				<BtnText buttonText="/" customClass="op" onclick={() => {}} />
				<BtnText buttonText="2" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="=" customClass="equal-btn btn__op" onclick={() => {}} />
				<strong class="answer font-digits">96</strong>
			</li>
			<li>Answer:<strong class="example font-digits">96 ft²</strong></li>
			<li>
				Calculate an example for the EU: A triangular flower bed has a base of 6 m and a height of
				2.5 m. What is its area?
			</li>
			<li>Enter into the calculator:</li>
			<li class="withIcon">
				<BtnText buttonText="(" customClass="op btn__func constanta" onclick={() => {}} />
				<BtnText buttonText="6" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="*" customClass="op" onclick={() => {}} />
				<BtnText buttonText="2" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="." customClass="btn__op" onclick={() => {}} />
				<BtnText buttonText="5" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText=")" customClass="op btn__func constanta" onclick={() => {}} />
				<BtnText buttonText="/" customClass="op" onclick={() => {}} />
				<BtnText buttonText="2" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="=" customClass="equal-btn btn__op" onclick={() => {}} />
				<strong class="answer font-digits">7.5</strong>
			</li>
			<li>Answer:<strong class="example font-digits">7.5 m²</strong></li>
		</ul>
	</div>

	<div class="card" id="AreaTrapezoid">
		<ul>
			<li class="example">
				<h2>Area of a Trapezoid</h2>
			</li>
			<li>
				<strong class="example">S = (a + b) × h / 2</strong>
			</li>
			<li>Why: Calculate the area of an irregular lot, a window opening, or an attic wall.</li>
			<li>
				Calculate an example for the US: An attic wall has parallel sides of 18 ft and 10 ft, with a
				height of 8 ft.
			</li>
			<li>Enter into the calculator:</li>
			<li class="withIcon tenMore">
				<BtnText buttonText="(" customClass="op btn__func constanta" onclick={() => {}} />
				<BtnText buttonText="(" customClass="op btn__func constanta" onclick={() => {}} />
				<BtnText buttonText="1" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="8" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="+" customClass="op" onclick={() => {}} />
				<BtnText buttonText="1" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="0" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText=")" customClass="op btn__func constanta" onclick={() => {}} />
				<BtnText buttonText="*" customClass="op" onclick={() => {}} />
				<BtnText buttonText="8" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText=")" customClass="op btn__func constanta" onclick={() => {}} />
				<BtnText buttonText="/" customClass="op" onclick={() => {}} />
				<BtnText buttonText="2" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="=" customClass="equal-btn btn__op" onclick={() => {}} />
				<strong class="answer font-digits">112</strong>
			</li>
			<li>Answer:<strong class="example font-digits">112 ft²</strong></li>
			<li>
				Calculate an example for the EU: A trapezoid-shaped garden has parallel sides of 5 m and 3
				m, with a height of 4 m.
			</li>
			<li>Enter into the calculator:</li>
			<li class="withIcon">
				<BtnText buttonText="(" customClass="op btn__func constanta" onclick={() => {}} />
				<BtnText buttonText="(" customClass="op btn__func constanta" onclick={() => {}} />
				<BtnText buttonText="5" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="+" customClass="op" onclick={() => {}} />
				<BtnText buttonText="3" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText=")" customClass="op btn__func constanta" onclick={() => {}} />
				<BtnText buttonText="*" customClass="op" onclick={() => {}} />
				<BtnText buttonText="4" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText=")" customClass="op btn__func constanta" onclick={() => {}} />
				<BtnText buttonText="/" customClass="op" onclick={() => {}} />
				<BtnText buttonText="2" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="=" customClass="equal-btn btn__op" onclick={() => {}} />
				<strong class="answer font-digits">16</strong>
			</li>
			<li>Answer:<strong class="example font-digits">16 m²</strong></li>
		</ul>
	</div>

	<div class="card" id="VolumeRectPrism">
		<ul>
			<li class="example">
				<h2>Volume of a Rectangular Prism (Room or Aquarium)</h2>
			</li>
			<li>
				<strong class="example">V = a × b × c</strong>
			</li>
			<li>
				Why: Calculate the volume of a room when choosing an air conditioner or determine how much
				water an aquarium or swimming pool can hold.
			</li>
			<li>
				Calculate an example for the US: A room measures 16 ft × 12 ft × 9 ft. What is its volume?
			</li>
			<li>Enter into the calculator:</li>
			<li class="withIcon">
				<BtnText buttonText="1" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="6" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="*" customClass="op" onclick={() => {}} />
				<BtnText buttonText="1" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="2" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="*" customClass="op" onclick={() => {}} />
				<BtnText buttonText="9" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="=" customClass="equal-btn btn__op" onclick={() => {}} />
				<strong class="answer font-digits">1728</strong>
			</li>
			<li>Answer:<strong class="example font-digits">1,728 ft³</strong></li>
			<li>
				Calculate an example for the EU: A room measures 5 m × 4 m × 2.8 m. What is its volume?
			</li>
			<li>Enter into the calculator:</li>
			<li class="withIcon">
				<BtnText buttonText="5" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="*" customClass="op" onclick={() => {}} />
				<BtnText buttonText="4" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="*" customClass="op" onclick={() => {}} />
				<BtnText buttonText="2" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="." customClass="btn__op" onclick={() => {}} />
				<BtnText buttonText="8" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="=" customClass="equal-btn btn__op" onclick={() => {}} />
				<strong class="answer font-digits">56</strong>
			</li>
			<li>Answer:<strong class="example font-digits">56 m³</strong></li>
		</ul>
	</div>

	<div class="card" id="ArithmeticMean">
		<ul>
			<li class="example">
				<h2>Arithmetic Mean (Average)</h2>
			</li>
			<li>
				<strong class="example">Average = (a₁ + a₂ + ... + aₙ) / n</strong>
			</li>
			<li>
				Why: Calculate the average fuel economy, the average purchase amount, or the average monthly
				temperature.
			</li>
			<li>
				Calculate an example for the US: Your car's fuel economy over four trips was 28, 31, 30, and
				29 mpg. What is the average?
			</li>
			<li>Enter into the calculator:</li>
			<li class="withIcon tenMore">
				<BtnText buttonText="(" customClass="op btn__func constanta" onclick={() => {}} />
				<BtnText buttonText="2" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="8" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="+" customClass="op" onclick={() => {}} />
				<BtnText buttonText="3" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="1" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="+" customClass="op" onclick={() => {}} />
				<BtnText buttonText="3" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="0" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="+" customClass="op" onclick={() => {}} />
				<BtnText buttonText="2" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="9" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText=")" customClass="op btn__func constanta" onclick={() => {}} />
				<BtnText buttonText="/" customClass="op" onclick={() => {}} />
				<BtnText buttonText="4" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="=" customClass="equal-btn btn__op" onclick={() => {}} />
				<strong class="answer font-digits">29.5</strong>
			</li>
			<li>Answer:<strong class="example font-digits">29.5 mpg</strong></li>
			<li>
				Calculate an example for the EU: Fuel consumption over four trips was 6.2, 5.8, 6.0, and 6.4
				L/100 km. What is the average?
			</li>
			<li>Enter into the calculator:</li>
			<li class="withIcon tenMore">
				<BtnText buttonText="(" customClass="op btn__func constanta" onclick={() => {}} />
				<BtnText buttonText="6" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="." customClass="btn__op" onclick={() => {}} />
				<BtnText buttonText="2" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="+" customClass="op" onclick={() => {}} />
				<BtnText buttonText="5" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="." customClass="btn__op" onclick={() => {}} />
				<BtnText buttonText="8" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="+" customClass="op" onclick={() => {}} />
				<BtnText buttonText="6" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="+" customClass="op" onclick={() => {}} />
				<BtnText buttonText="6" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="." customClass="btn__op" onclick={() => {}} />
				<BtnText buttonText="4" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText=")" customClass="op btn__func constanta" onclick={() => {}} />
				<BtnText buttonText="/" customClass="op" onclick={() => {}} />
				<BtnText buttonText="4" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="=" customClass="equal-btn btn__op" onclick={() => {}} />
				<strong class="answer font-digits">6.1</strong>
			</li>
			<li>Answer:<strong class="example font-digits">6.1 L/100 km</strong></li>
		</ul>
	</div>

	<div class="card" id="SurfAreaRectPrism">
		<ul>
			<li class="example">
				<h2>Surface Area of a Rectangular Prism (Walls, Floor, and Ceiling)</h2>
			</li>
			<li>
				<strong class="example">S = 2(ab + bc + ac)</strong>
			</li>
			<li>
				Why: Calculate the exact amount of paint needed for all walls, the floor, and the ceiling of
				a room (without subtracting doors and windows).
			</li>
			<li>
				Calculate an example for the US: A room measures 16 ft × 12 ft with a ceiling height of 9
				ft. What is the total interior surface area?
			</li>
			<li>Enter into the calculator:</li>
			<li class="withIcon tenMore">
				<BtnText buttonText="2" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="*" customClass="op" onclick={() => {}} />
				<BtnText buttonText="(" customClass="op btn__func constanta" onclick={() => {}} />
				<BtnText buttonText="(" customClass="op btn__func constanta" onclick={() => {}} />
				<BtnText buttonText="1" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="6" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="*" customClass="op" onclick={() => {}} />
				<BtnText buttonText="1" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="2" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText=")" customClass="op btn__func constanta" onclick={() => {}} />
				<BtnText buttonText="+" customClass="op" onclick={() => {}} />
				<BtnText buttonText="(" customClass="op btn__func constanta" onclick={() => {}} />
				<BtnText buttonText="1" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="2" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="*" customClass="op" onclick={() => {}} />
				<BtnText buttonText="9" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText=")" customClass="op btn__func constanta" onclick={() => {}} />
				<BtnText buttonText="+" customClass="op" onclick={() => {}} />
				<BtnText buttonText="(" customClass="op btn__func constanta" onclick={() => {}} />
				<BtnText buttonText="1" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="6" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="*" customClass="op" onclick={() => {}} />
				<BtnText buttonText="9" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText=")" customClass="op btn__func constanta" onclick={() => {}} />
				<BtnText buttonText=")" customClass="op btn__func constanta" onclick={() => {}} />
				<BtnText buttonText="=" customClass="equal-btn btn__op" onclick={() => {}} />
				<strong class="answer font-digits">888</strong>
			</li>
			<li>Answer:<strong class="example font-digits">888 ft²</strong></li>
			<li>
				Calculate an example for the EU: A room measures 5 m × 4 m with a ceiling height of 2.8 m.
				What is the total interior surface area?
			</li>
			<li>Enter into the calculator:</li>
			<li class="withIcon tenMore">
				<BtnText buttonText="2" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="*" customClass="op" onclick={() => {}} />
				<BtnText buttonText="(" customClass="op btn__func constanta" onclick={() => {}} />
				<BtnText buttonText="(" customClass="op btn__func constanta" onclick={() => {}} />
				<BtnText buttonText="5" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="*" customClass="op" onclick={() => {}} />
				<BtnText buttonText="4" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText=")" customClass="op btn__func constanta" onclick={() => {}} />
				<BtnText buttonText="+" customClass="op" onclick={() => {}} />
				<BtnText buttonText="(" customClass="op btn__func constanta" onclick={() => {}} />
				<BtnText buttonText="4" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="*" customClass="op" onclick={() => {}} />
				<BtnText buttonText="2" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="." customClass="btn__op" onclick={() => {}} />
				<BtnText buttonText="8" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText=")" customClass="op btn__func constanta" onclick={() => {}} />
				<BtnText buttonText="+" customClass="op" onclick={() => {}} />
				<BtnText buttonText="(" customClass="op btn__func constanta" onclick={() => {}} />
				<BtnText buttonText="5" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="*" customClass="op" onclick={() => {}} />
				<BtnText buttonText="2" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="." customClass="btn__op" onclick={() => {}} />
				<BtnText buttonText="8" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText=")" customClass="op btn__func constanta" onclick={() => {}} />
				<BtnText buttonText=")" customClass="op btn__func constanta" onclick={() => {}} />
				<BtnText buttonText="=" customClass="equal-btn btn__op" onclick={() => {}} />
				<strong class="answer font-digits">90.4</strong>
			</li>
			<li>Answer:<strong class="example font-digits">90.4 m²</strong></li>
		</ul>
	</div>

	<div class="card" id="ArcLengthCircle">
		<ul>
			<li class="example">
				<h2>Arc Length of a Circle</h2>
			</li>
			<li>
				<strong class="example">L = (π × R × α) / 180°</strong>
			</li>
			<li>(where α is the central angle in degrees)</li>
			<li>
				Why: Calculate the length of an arch, a curved curtain rod, or the amount of fabric needed
				for an arched window.
			</li>
			<li>
				Calculate an example for the US: An arched doorway has a radius of 4 ft and a central angle
				of 90°. What is the length of the arch?
			</li>
			<li>Enter into the calculator:</li>
			<li class="withIcon tenMore">
				<BtnText buttonText="(" customClass="op btn__func constanta" onclick={() => {}} />
				<BtnText buttonText="π" customClass="op btn__func constanta" onclick={() => {}} />
				<BtnText buttonText="*" customClass="op" onclick={() => {}} />
				<BtnText buttonText="4" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="*" customClass="op" onclick={() => {}} />
				<BtnText buttonText="9" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="0" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText=")" customClass="op btn__func constanta" onclick={() => {}} />
				<BtnText buttonText="/" customClass="op" onclick={() => {}} />
				<BtnText buttonText="1" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="8" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="0" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="=" customClass="equal-btn btn__op" onclick={() => {}} />
				<strong class="answer font-digits">6.28</strong>
			</li>
			<li>Answer:<strong class="example font-digits">6.28 ft</strong></li>
			<li>
				Calculate an example for the EU: An arched window has a radius of 1.5 m and a central angle
				of 120°. What is the length of the arch?
			</li>
			<li>Enter into the calculator:</li>
			<li class="withIcon tenMore">
				<BtnText buttonText="(" customClass="op btn__func constanta" onclick={() => {}} />
				<BtnText buttonText="π" customClass="op btn__func constanta" onclick={() => {}} />
				<BtnText buttonText="*" customClass="op" onclick={() => {}} />
				<BtnText buttonText="1" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="." customClass="btn__op" onclick={() => {}} />
				<BtnText buttonText="5" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="*" customClass="op" onclick={() => {}} />
				<BtnText buttonText="1" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="2" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="0" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText=")" customClass="op btn__func constanta" onclick={() => {}} />
				<BtnText buttonText="/" customClass="op" onclick={() => {}} />
				<BtnText buttonText="1" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="8" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="0" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="=" customClass="equal-btn btn__op" onclick={() => {}} />
				<strong class="answer font-digits">3.14</strong>
			</li>
			<li>Answer:<strong class="example font-digits">3.14 m</strong></li>
		</ul>
	</div>

	<div class="card" id="VolumeCylinder">
		<ul>
			<li class="example">
				<h2>Volume of a Cylinder</h2>
			</li>
			<li>
				<strong class="example">V = π × R² × h</strong>
			</li>
			<li>
				Why: Calculate the volume of a barrel, bucket, pipe, or the amount of concrete needed for a
				round column.
			</li>
			<li>
				Calculate an example for the US: A rain barrel has a radius of 1.5 ft and a height of 4 ft.
				How much volume does it hold?
			</li>

			<li>Enter into the calculator:</li>
			<li class="withIcon tenMore">
				<BtnText buttonText="π" customClass="op btn__func constanta" onclick={() => {}} />
				<BtnText buttonText="*" customClass="op" onclick={() => {}} />
				<BtnText buttonText="1" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="." customClass="btn__op" onclick={() => {}} />
				<BtnText buttonText="5" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="x^2" customClass="op btn__func" onclick={() => {}} />
				<BtnText buttonText="*" customClass="op" onclick={() => {}} />
				<BtnText buttonText="4" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="=" customClass="equal-btn btn__op" onclick={() => {}} />
				<strong class="answer font-digits">28.27</strong>
			</li>
			<li>Answer:<strong class="example font-digits">28.27 ft³</strong></li>
			<li>
				Calculate an example for the EU: A water tank has a radius of 0.5 m and a height of 2 m.
				What is its volume?
			</li>
			<li>Enter into the calculator:</li>
			<li class="withIcon tenMore">
				<BtnText buttonText="π" customClass="op btn__func constanta" onclick={() => {}} />
				<BtnText buttonText="*" customClass="op" onclick={() => {}} />
				<BtnText buttonText="0" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="." customClass="btn__op" onclick={() => {}} />
				<BtnText buttonText="5" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="x^2" customClass="op btn__func" onclick={() => {}} />
				<BtnText buttonText="*" customClass="op" onclick={() => {}} />
				<BtnText buttonText="2" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="=" customClass="equal-btn btn__op" onclick={() => {}} />
				<strong class="answer font-digits">1.57</strong>
			</li>
			<li>Answer:<strong class="example font-digits">1.57 m³</strong></li>
		</ul>
	</div>

	<div class="card" id="CalcWallRolls">
		<ul>
			<li class="example">
				<h2>Calculating the Number of Wallpaper Rolls</h2>
			</li>
			<li>
				<strong class="example">Q = (P × h) / (a × b)</strong>
			</li>
			<li>Number of rolls = ((Perimeter × Wall Height) / (Roll Length × Roll Width)) × 1.1</li>
			<li>
				Why: Buy the right number of wallpaper rolls without making another trip to the store,
				including a recommended 10% allowance for trimming and waste.
			</li>
			<li>
				Calculate an example for the US: A room measures 13.12 ft × 13 ft 1.5 in (13.13 ft) with a
				ceiling height of 10 ft 6 in (10.5 ft). The wallpaper roll is 2 ft wide and 32.8 ft long.
			</li>
			<li>Enter into the calculator:</li>
			<li class="withIcon tenMore">
				<BtnText buttonText="(" customClass="op btn__func constanta" onclick={() => {}} />
				<BtnText buttonText="(" customClass="op btn__func constanta" onclick={() => {}} />
				<BtnText buttonText="2" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="*" customClass="op" onclick={() => {}} />

				<BtnText buttonText="1" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="3" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="." customClass="btn__op" onclick={() => {}} />
				<BtnText buttonText="1" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="2" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="+" customClass="op" onclick={() => {}} />
				<BtnText buttonText="1" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="3" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="." customClass="btn__op" onclick={() => {}} />
				<BtnText buttonText="1" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="3" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText=")" customClass="op btn__func constanta" onclick={() => {}} />
				<BtnText buttonText="*" customClass="op" onclick={() => {}} />
				<BtnText buttonText="1" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="0" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="." customClass="btn__op" onclick={() => {}} />
				<BtnText buttonText="5" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText=")" customClass="op btn__func constanta" onclick={() => {}} />

				<BtnText buttonText="/" customClass="op" onclick={() => {}} />

				<BtnText buttonText="(" customClass="op btn__func constanta" onclick={() => {}} />
				<BtnText buttonText="2" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="*" customClass="op" onclick={() => {}} />
				<BtnText buttonText="3" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="2" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="." customClass="btn__op" onclick={() => {}} />
				<BtnText buttonText="8" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText=")" customClass="op btn__func constanta" onclick={() => {}} />
				<BtnText buttonText=")" customClass="op btn__func constanta" onclick={() => {}} />
				<BtnText buttonText="*" customClass="op" onclick={() => {}} />
				<BtnText buttonText="1" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="." customClass="btn__op" onclick={() => {}} />
				<BtnText buttonText="1" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="=" customClass="equal-btn btn__op" onclick={() => {}} />
				<strong class="answer font-digits">9.24</strong>
			</li>
			<li>Answer:<strong class="example font-digits">9.24 rolls</strong></li>
			<li>
				Calculate an example for the EU: A room measures 4 m × 5 m with a ceiling height of 3.2 m.
				The wallpaper roll is 0.6 m wide and 10 m long.
			</li>
			<li>Enter into the calculator:</li>
			<li class="withIcon tenMore">
				<BtnText buttonText="(" customClass="op btn__func constanta" onclick={() => {}} />
				<BtnText buttonText="(" customClass="op btn__func constanta" onclick={() => {}} />
				<BtnText buttonText="2" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="*" customClass="op" onclick={() => {}} />

				<BtnText buttonText="4" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="+" customClass="op" onclick={() => {}} />
				<BtnText buttonText="5" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText=")" customClass="op btn__func constanta" onclick={() => {}} />
				<BtnText buttonText="*" customClass="op" onclick={() => {}} />
				<BtnText buttonText="3" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="." customClass="btn__op" onclick={() => {}} />
				<BtnText buttonText="2" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText=")" customClass="op btn__func constanta" onclick={() => {}} />

				<BtnText buttonText="/" customClass="op" onclick={() => {}} />

				<BtnText buttonText="(" customClass="op btn__func constanta" onclick={() => {}} />
				<BtnText buttonText="0" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="." customClass="btn__op" onclick={() => {}} />
				<BtnText buttonText="6" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="*" customClass="op" onclick={() => {}} />
				<BtnText buttonText="1" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="0" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText=")" customClass="op btn__func constanta" onclick={() => {}} />
				<BtnText buttonText=")" customClass="op btn__func constanta" onclick={() => {}} />
				<BtnText buttonText="*" customClass="op" onclick={() => {}} />
				<BtnText buttonText="1" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="." customClass="btn__op" onclick={() => {}} />
				<BtnText buttonText="1" customClass="font-digits" onclick={() => {}} />
				<BtnText buttonText="=" customClass="equal-btn btn__op" onclick={() => {}} />
				<strong class="answer font-digits">10.56</strong>
			</li>
			<li>Answer:<strong class="example font-digits">10.56 rolls</strong></li>
		</ul>
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
		margin: 2rem auto;
	}

	strong.answer {
		font-size: 2.6rem;

		&.tenMore {
			font-size: 1.6rem;
		}
	}

	strong.example {
		padding-left: 0.5rem;
		color: $clr-coral;
	}
</style>
