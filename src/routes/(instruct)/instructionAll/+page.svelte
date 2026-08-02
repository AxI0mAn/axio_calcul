<script>
	// @ts-ignore
	import { base } from '$app/paths';
	import BtnBack from '$lib/components/Btn/BtnBack.svelte';

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
	<h1 class="headerSlogan">Instruction for App.</h1>
</header>

<main class="homeTextPage faqPage">
	<section class="section">
		<div class="card">
			<a class="bigLink" href="{base}/instructionInterface">
				<h2>Getting Started</h2>
				<ul>
					<li>Adjusting calculation precision.</li>
					<li>Configuring calculation history storage.</li>
					<li>Reusing results from previous calculations.</li>
					<li>Quickly switching between calculators within the same category.</li>
					<li>Quick navigation throughout the app.</li>
				</ul>
				<p class="learnMore">Get Started</p>
			</a>
		</div>
		<div class="card">
			<a class="bigLink" href="{base}/instructionGeneral">
				<h2>General Features</h2>
				<ul>
					<li>Main keypad: Entering and deleting numbers.</li>
					<li>Clearing the current calculation history.</li>
					<li>Basic operator keypad: +, −, ×, ÷, =, and decimal point.</li>
					<li>Memory buttons: Saving and recalling values.</li>
					<li>Sending a result to another calculator.</li>
				</ul>
				<p class="learnMore">Explore</p>
			</a>
		</div>
		<div class="card">
			<a class="bigLink" href="{base}/basic#instructionBasic">
				<h2>Basic Calculator</h2>
				<ul>
					<li>Basic operations: +, −, ×, ÷, =, and the decimal point.</li>
					<li>
						Additional function keypad:
						<ul>
							<li>Available constants.</li>
							<li>Calculating percentages.</li>
							<li>Calculating a factorial.</li>
							<li>Raising a number to a power.</li>
							<li>Calculating square roots.</li>
							<li>Rounding numbers.</li>
						</ul>
					</li>
					<li>Long and complex expressions.</li>
				</ul>
				<p class="learnMore">Learn More</p>
			</a>
		</div>
		<div class="card">
			<a class="bigLink" href="{base}/fraction#instructionFraction">
				<h2>Calculator for Fraction</h2>
				<ul>
					<li>Basic fraction operations: +, −, ×, ÷, and =.</li>
					<li>Full expressions with number stacked fractions.</li>
					<li>Long and complex fraction expressions with parentheses.</li>
					<li>View step-by-step solutions.</li>
					<li>
						Additional function keypad:
						<ul>
							<li>Fraction Calculator</li>
							<li>Simplify Fractions</li>
							<li>Fraction to Decimal</li>
							<li>Decimal to Fraction</li>
							<li>Convert improper fractions to mixed numbers.</li>
							<li>Mixed Number Calculator</li>
							<li>Improper Fraction Calculator</li>
							<li>Fraction Exponent Calculator</li>
						</ul>
					</li>
				</ul>
				<p class="learnMore">Read More</p>
			</a>
		</div>
		<div class="card">
			<a class="bigLink" href="{base}/engineer#instructionEngineer">
				<h2>Scientific Calculator for Engineers</h2>
				<ul>
					<li>All basic operations and features from the Basic Calculator.</li>
					<li>Long and complex expressions with parentheses.</li>
					<li>
						Additional function keypad:
						<ul>
							<li>More available constants.</li>
							<li>The golden ratio.</li>
							<li>Random numbers within a specified range.</li>
							<li>Logarithms.</li>
							<li>Greatest common divisor (GCD) of two numbers.</li>
							<li>Prime factorization.</li>
							<li>More functions.</li>
						</ul>
					</li>
				</ul>
				<p class="learnMore">See More</p>
			</a>
		</div>
		<div class="card">
			<a class="bigLink" href="{base}/trigonometry#instructionTrigonometry">
				<h2>Trigonometry Calculator</h2>
				<ul>
					<li>All basic arithmetic operations.</li>
					<li>Trigonometric functions.</li>
					<li>Inverse trigonometric functions.</li>
					<li>Hyperbolic functions.</li>
					<li>Inverse hyperbolic functions.</li>
					<li>
						Supports three angle units:
						<ul>
							<li>Degrees (°)</li>
							<li>Radians (rad)</li>
							<li>Gradians (gon)</li>
						</ul>
					</li>
					<li>Switch between angle units at any time before performing a calculation.</li>
				</ul>
				<p class="learnMore">View Details</p>
			</a>
		</div>
	</section>
</main>

<style lang="scss">
	.card {
		margin-bottom: 1rem;
		background-color: transparent;
		&:hover {
			box-shadow: $shadow-neon-coral;
			.learnMore {
				color: $clr-coral;
				border-right: 1px double $clr-coral;
				border-radius: 0.5rem;
			}
		}
		.bigLink {
			width: 100%;
			height: 100%;
		}
		.learnMore {
			text-align: right;
			margin-top: 0.5rem;
			padding: 0.5rem 2rem;
		}
	}
</style>
