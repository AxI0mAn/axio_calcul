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
	<h1 class="headerSlogan" id="instructionTrigonometry">Trigonometry Calculator</h1>
</header>

<main class="homeTextPage calcInstrPage">
	<div class="card">
		<h2>Introduction</h2>
		<h3>Online/<strong>Offline</strong> Trigonometry Calculator</h3>
		<div>
			<p>
				The Trigonometry Calculator provides a fast and convenient way to calculate common
				trigonometric, inverse trigonometric, and hyperbolic functions.
			</p>
			<p>
				It supports multiple angle units, making it suitable for mathematics, engineering, physics,
				electronics, surveying, navigation, and education.
			</p>
			<p>
				All calculations are performed directly in your browser, with no registration or
				installation required.
			</p>
			<!-- src/lib/services/math/mathBaseBtn.js -->
			<p>Trigonometric calculations always use <strong>12</strong> decimal places.</p>
			<p>
				For all other calculators, you can adjust the calculation precision in <a
					href="{base}/instructionInterface#instr_CalcPrecis"><strong>Settings</strong>.</a
				>
			</p>
		</div>
	</div>

	<div class="card">
		<h2>Angle Units</h2>
		<p>The calculator supports the three most commonly used angular measurement systems.</p>

		<h3 class="example">Degrees</h3>
		<div>
			<p>The standard unit used in schools, geometry, navigation, and everyday calculations.</p>
			<p>Example:</p>
			<ul>
				<li>90°</li>
				<li>135.45</li>
				<li>180°</li>
				<li>360°</li>
			</ul>
		</div>
		<h3 class="example">Radians</h3>
		<div>
			<p>
				The standard unit used in higher mathematics, calculus, engineering, and most programming
				languages.
			</p>
			<p>Example:</p>
			<ul>
				<li>π/2</li>
				<li>π</li>
				<li>0.45</li>
				<li>2π</li>
			</ul>
		</div>
		<h3 class="example">Gradians</h3>
		<div>
			<p>Also known as gons.</p>
			<p>Commonly used in surveying and civil engineering.</p>
			<p>Example:</p>
			<ul>
				<li>100 gon</li>
				<li>200 gon</li>
				<li>400 gon</li>
			</ul>
		</div>
	</div>
	<div class="card">
		<h2>Features</h2>
		<p>The calculator includes:</p>
		<AccordionDetails castomClass="optionCalc" name="my-accordion">
			{#snippet summary()}
				<h3>Basic Arithmetic</h3>
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
				<h3>Angle Units</h3>
			{/snippet}
			<div>
				<ul>
					<li class="withIcon">The calculator supports three <br /> angle measurement systems:</li>
					<li class="withIcon">
						Degrees (°) <BtnText buttonText="deg" customClass="trigMode" onclick={() => {}} />
					</li>
					<li class="withIcon">
						Radians (rad) <BtnText buttonText="rad" customClass="trigMode" onclick={() => {}} />
					</li>
					<li class="withIcon">
						Gradians (gon) <BtnText buttonText="grad" customClass="trigMode" onclick={() => {}} />
					</li>
					<li class="withIcon">
						Switch between units at any time <br /> before performing calculations.
					</li>
				</ul>
			</div>
		</AccordionDetails>

		<AccordionDetails castomClass="optionCalc" name="my-accordion">
			{#snippet summary()}
				<h3>Trigonometric Functions</h3>
			{/snippet}
			<div>
				<ul>
					<li class="withIcon">
						sin(x) <BtnText
							customClass="op btn__func trigonom"
							onclick={() => {}}
							buttonText="sin"
						/>
					</li>
					<li class="withIcon">
						cos(x) <BtnText
							customClass="op btn__func trigonom"
							onclick={() => {}}
							buttonText="cos"
						/>
					</li>
					<li class="withIcon">
						tan(x) <BtnText
							customClass="op btn__func trigonom"
							onclick={() => {}}
							buttonText="tan"
						/>
					</li>
					<li class="withIcon">
						cot(x) <BtnText
							customClass="op btn__func trigonom"
							onclick={() => {}}
							buttonText="cot"
						/>
					</li>
				</ul>
			</div>
		</AccordionDetails>

		<AccordionDetails castomClass="optionCalc" name="my-accordion">
			{#snippet summary()}
				<h3>Inverse Trigonometric Functions</h3>
			{/snippet}
			<div>
				<ul>
					<li class="withIcon">
						asin(x) <BtnText
							customClass="op btn__func trigonom"
							onclick={() => {}}
							buttonText="asin"
						/>
					</li>
					<li class="withIcon">
						acos(x) <BtnText
							customClass="op btn__func trigonom"
							onclick={() => {}}
							buttonText="acos"
						/>
					</li>
					<li class="withIcon">
						atan(x) <BtnText
							customClass="op btn__func trigonom"
							onclick={() => {}}
							buttonText="atan"
						/>
					</li>
					<li class="withIcon">
						acot(x) <BtnText
							customClass="op btn__func trigonom"
							onclick={() => {}}
							buttonText="acot"
						/>
					</li>
				</ul>
			</div>
		</AccordionDetails>

		<AccordionDetails castomClass="optionCalc" name="my-accordion">
			{#snippet summary()}
				<h3>Hyperbolic Functions</h3>
			{/snippet}
			<div>
				<ul>
					<li class="withIcon">
						sinh(x) <BtnText
							customClass="op btn__func trigonom"
							onclick={() => {}}
							buttonText="sinh"
						/>
					</li>
					<li class="withIcon">
						cosh(x) <BtnText
							customClass="op btn__func trigonom"
							onclick={() => {}}
							buttonText="cosh"
						/>
					</li>
					<li class="withIcon">
						tanh(x) <BtnText
							customClass="op btn__func trigonom"
							onclick={() => {}}
							buttonText="tanh"
						/>
					</li>
					<li class="withIcon">
						coth(x) <BtnText
							customClass="op btn__func trigonom"
							onclick={() => {}}
							buttonText="coth"
						/>
					</li>
				</ul>
			</div>
		</AccordionDetails>

		<AccordionDetails castomClass="optionCalc" name="my-accordion">
			{#snippet summary()}
				<h3>Inverse Hyperbolic Functions</h3>
			{/snippet}
			<div>
				<ul>
					<li class="withIcon">
						asinh(x) <BtnText
							customClass="op btn__func trigonom"
							onclick={() => {}}
							buttonText="asinh"
						/>
					</li>
					<li class="withIcon">
						acosh(x) <BtnText
							customClass="op btn__func trigonom"
							onclick={() => {}}
							buttonText="acosh"
						/>
					</li>
					<li class="withIcon">
						atanh(x) <BtnText
							customClass="op btn__func trigonom"
							onclick={() => {}}
							buttonText="atanh"
						/>
					</li>
					<li class="withIcon">
						acoth(x) <BtnText
							customClass="op btn__func trigonom"
							onclick={() => {}}
							buttonText="acoth"
						/>
					</li>
				</ul>
			</div>
		</AccordionDetails>
	</div>

	<div class="card">
		<h2>How to Use</h2>
		<h3>Fast Online Basic Calculator</h3>
		<div>
			<ol>
				<li>
					<p>Select the desired angle unit:</p>
					<ul>
						<li>◦ Degrees</li>
						<li>◦ Radians</li>
						<li>◦ Gradians</li>
					</ul>
				</li>
				<li>Enter the value.</li>
				<li>Choose the required trigonometric function.</li>
				<li>The calculator immediately computes the result.</li>
			</ol>
			<p>
				Always ensure the correct angle unit is selected before calculating, as the same numeric
				value represents different angles in different measurement systems.
			</p>
		</div>
	</div>

	<div class="card">
		<h2>Examples:</h2>
		<div>
			<ul>
				<li class="example">
					<strong>Sine</strong>
				</li>
				<li>sin(30°) = 0.5</li>
				<li class="withIcon">
					<BtnText customClass="font-digits" buttonText="3" onclick={() => {}} />
					<BtnText customClass="font-digits" buttonText="0" onclick={() => {}} />
					<BtnText customClass="op btn__func trigonom" onclick={() => {}} buttonText="sin" />
					<BtnText customClass="equal-btn btn__op" onclick={() => {}} buttonText="=" />
					<strong class="answer font-digits">0.5</strong>
				</li>
			</ul>
		</div>

		<div>
			<ul>
				<li class="example">
					<strong>Cosine</strong>
				</li>
				<li>cos(60°) = 0.5</li>
				<li class="withIcon">
					<BtnText buttonText="6" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="0" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="cos" customClass="op btn__func trigonom" onclick={() => {}} />
					<BtnText buttonText="=" customClass="equal-btn btn__op" onclick={() => {}} />
					<strong class="answer font-digits">0.5</strong>
				</li>
			</ul>
		</div>

		<div>
			<ul>
				<li class="example">
					<strong>Tangent</strong>
				</li>
				<li>tan(45°) = 1</li>
				<li class="withIcon">
					<BtnText buttonText="4" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="5" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="tan" customClass="op btn__func trigonom" onclick={() => {}} />
					<BtnText buttonText="=" customClass="equal-btn btn__op" onclick={() => {}} />
					<strong class="answer font-digits">1</strong>
				</li>
			</ul>
		</div>

		<div>
			<ul>
				<li class="example">
					<strong>Cotangent</strong>
				</li>
				<li>cot(45°) = 1</li>
				<li class="withIcon">
					<BtnText buttonText="4" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="5" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="cot" customClass="op btn__func trigonom" onclick={() => {}} />
					<BtnText buttonText="=" customClass="equal-btn btn__op" onclick={() => {}} />
					<strong class="answer font-digits">1</strong>
				</li>
			</ul>
		</div>

		<div>
			<ul>
				<li class="example">
					<strong>Inverse Sine</strong>
				</li>
				<li>asin(0.5 rad) = 30°</li>
				<li class="withIcon">
					<BtnText buttonText="0" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="." customClass="btn__op" onclick={() => {}} />
					<BtnText buttonText="5" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="asin" customClass="op btn__func trigonom" onclick={() => {}} />
					<BtnText buttonText="=" customClass="equal-btn btn__op" onclick={() => {}} />
					<strong class="answer font-digits">30</strong>
				</li>
			</ul>
		</div>

		<div>
			<ul>
				<li class="example">
					<strong>Inverse Cosine</strong>
				</li>
				<li>acos(0.5 rad) = 60°</li>
				<li class="withIcon">
					<BtnText buttonText="0" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="." customClass="btn__op" onclick={() => {}} />
					<BtnText buttonText="5" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="acos" customClass="op btn__func trigonom" onclick={() => {}} />
					<BtnText buttonText="=" customClass="equal-btn btn__op" onclick={() => {}} />
					<strong class="answer font-digits">60</strong>
				</li>
			</ul>
		</div>

		<div>
			<ul>
				<li class="example">
					<strong>Inverse Tangent</strong>
				</li>
				<li>atan(1 rad) = 45°</li>
				<li class="withIcon">
					<BtnText buttonText="1" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="atan" customClass="op btn__func trigonom" onclick={() => {}} />
					<BtnText buttonText="=" customClass="equal-btn btn__op" onclick={() => {}} />
					<strong class="answer font-digits">45</strong>
				</li>
			</ul>
		</div>

		<div>
			<ul>
				<li class="example">
					<strong>Hyperbolic Sine</strong>
				</li>
				<li>sinh(1 rad) ≈ 1.175201</li>
				<li class="withIcon">
					<BtnText buttonText="1" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="sinh" customClass="op btn__func trigonom" onclick={() => {}} />
					<BtnText buttonText="=" customClass="equal-btn btn__op" onclick={() => {}} />
					<strong class="answer font-digits">1.175201</strong>
				</li>
			</ul>
		</div>

		<div>
			<ul>
				<li class="example">
					<strong>Hyperbolic Cosine</strong>
				</li>
				<li>cosh(1 rad) ≈ 1.543081</li>
				<li class="withIcon">
					<BtnText buttonText="1" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="cosh" customClass="op btn__func trigonom" onclick={() => {}} />
					<BtnText buttonText="=" customClass="equal-btn btn__op" onclick={() => {}} />
					<strong class="answer font-digits">1.543081</strong>
				</li>
			</ul>
		</div>

		<div>
			<ul>
				<li class="example">
					<strong>Hyperbolic Tangent</strong>
				</li>
				<li>tanh(1 rad) ≈ 0.761594</li>
				<li class="withIcon">
					<BtnText buttonText="1" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="tanh" customClass="op btn__func trigonom" onclick={() => {}} />
					<BtnText buttonText="=" customClass="equal-btn btn__op" onclick={() => {}} />
					<strong class="answer font-digits">0.761594</strong>
				</li>
			</ul>
		</div>

		<div>
			<ul>
				<li class="example">
					<strong>Inverse Cotangent </strong>
				</li>
				<li>acot(1 rad) ≈ 0.785398</li>
				<li class="withIcon">
					<BtnText buttonText="1" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="acot" customClass="op btn__func trigonom" onclick={() => {}} />
					<BtnText buttonText="=" customClass="equal-btn btn__op" onclick={() => {}} />
					<strong class="answer font-digits">0.785398</strong>
				</li>
			</ul>
		</div>

		<div>
			<ul>
				<li class="example">
					<strong>Hyperbolic Cotangent</strong>
				</li>
				<li>coth(1 rad) ≈ 1.313035$</li>
				<li class="withIcon">
					<BtnText buttonText="1" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="coth" customClass="op btn__func trigonom" onclick={() => {}} />
					<BtnText buttonText="=" customClass="equal-btn btn__op" onclick={() => {}} />
					<strong class="answer font-digits">1.313035</strong>
				</li>
			</ul>
		</div>

		<div>
			<ul>
				<li class="example">
					<strong>Inverse Hyperbolic Sine</strong>
				</li>
				<li>asinh (1 rad) ≈ 0.881374</li>
				<li class="withIcon">
					<BtnText buttonText="1" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="asinh" customClass="op btn__func trigonom" onclick={() => {}} />
					<BtnText buttonText="=" customClass="equal-btn btn__op" onclick={() => {}} />
					<strong class="answer font-digits">0.881374</strong>
				</li>
			</ul>
		</div>

		<div>
			<ul>
				<li class="example">
					<strong>Inverse Hyperbolic Cosine</strong>
				</li>
				<li>acosh (2 rad) ≈ 1.316958</li>
				<li class="withIcon">
					<BtnText buttonText="2" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="acosh" customClass="op btn__func trigonom" onclick={() => {}} />
					<BtnText buttonText="=" customClass="equal-btn btn__op" onclick={() => {}} />
					<strong class="answer font-digits">1.316958</strong>
				</li>
			</ul>
		</div>

		<div>
			<ul>
				<li class="example">
					<strong>Inverse Hyperbolic Tangent</strong>
				</li>
				<li>atanh (0.5 rad) ≈ 0.549306</li>
				<li class="withIcon">
					<BtnText buttonText="0" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="." customClass="btn__op" onclick={() => {}} />
					<BtnText buttonText="5" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="atanh" customClass="op btn__func trigonom" onclick={() => {}} />
					<BtnText buttonText="=" customClass="equal-btn btn__op" onclick={() => {}} />
					<strong class="answer font-digits">0.549306</strong>
				</li>
			</ul>
		</div>

		<div>
			<ul>
				<li class="example">
					<strong>Inverse Hyperbolic Cotangent</strong>
				</li>
				<li>acoth (2 rad) ≈ 0.549306</li>
				<li class="withIcon">
					<BtnText buttonText="2" customClass="font-digits" onclick={() => {}} />
					<BtnText buttonText="acoth" customClass="op btn__func trigonom" onclick={() => {}} />
					<BtnText buttonText="=" customClass="equal-btn btn__op" onclick={() => {}} />
					<strong class="answer font-digits"> 0.549306</strong>
				</li>
			</ul>
		</div>
	</div>
</main>

<style lang="scss">
	@use '../../../../styles/_instructionPages.scss';
	@use '../../../../styles/_variables.scss' as *;

	.card {
		&:hover {
			box-shadow: $shadow-inset;
		}
	}

	h2 {
		margin: 2rem auto;
	}

	h3.example {
		margin: 0 auto;
		width: 92%;
		text-align: center;
		font-size: 1.2rem;
		color: $clr-sky;
		border-top: 2px solid rgba($clr-sky-rgb, 0.33);
	}

	strong.answer {
		font-size: 2.6rem;
	}

	strong.example {
		padding-left: 0.5rem;
		color: $clr-coral;
	}
</style>
