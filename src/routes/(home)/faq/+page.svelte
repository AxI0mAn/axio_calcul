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
	<h1 class="headerSlogan">FAQ</h1>
</header>

<main class="homeTextPage faqPage">
	<h2>A few helpful tips.</h2>
	<section class="card">
		<p>⭐ Tap and hold a calculation result in your history to quickly save it.</p>
		<p>⭐ Switch to the Engineering Calculator without losing your current expression.</p>
		<p>⭐ Your calculation history remains available between sessions.</p>
		<p>⭐ Most calculators work offline after the Application has been installed.</p>
		<p>
			⭐ We recommend breaking down complex expressions into simpler ones when performing
			calculations.
		</p>
	</section>
	<h2>General</h2>
	<div class="genralFAQ">
		<section class="card">
			<h3>What is this Application?</h3>
			<p>
				This Application is a collection of calculators, converters, and practical mathematical
				tools designed for everyday, educational, engineering, financial, and professional
				calculations.
			</p>
			<p>
				Unlike many online calculators, compatible tools share a common interface and can work
				together, allowing you to continue calculations across different calculators.
			</p>
		</section>
		<section class="card">
			<h3>Is the Application free?</h3>
			<p>Yes.</p>
			<p>All available calculators can be used free of charge.</p>
		</section>
		<section class="card">
			<h3>Do I need to create an account?</h3>
			<p>No.</p>
			<p>Registration and user accounts are not required.</p>
		</section>
		<section class="card">
			<h3>Does the Application work offline?</h3>
			<p>Yes.</p>
			<p>
				Once installed as a Progressive Web App (PWA), many functions remain available without an
				Internet connection.
			</p>
		</section>
	</div>
	<h2>Calculations</h2>
	<section class="card">
		<h3>Can I enter numbers, parentheses, and operators directly from my computer keyboard?</h3>
		<p>Yes.</p>
		<p>
			You can use your PC or laptop keyboard to enter numbers, parentheses, and operators directly
			into the calculator.
		</p>
	</section>
	<section class="card">
		<h3>Are my calculations saved?</h3>
		<p>Yes.</p>
		<p>
			Completed calculations are stored locally on your device and appear in the calculation
			history.
		</p>
		<p>Nothing is uploaded to our servers.</p>
	</section>
	<section class="card">
		<h3>Can I continue a calculation in another calculator?</h3>
		<p>Yes.</p>
		<p>Compatible mathematical calculators share the same calculation workspace.</p>
		<p>
			You can switch between them using the Quick Switch button in the upper-right corner without
			losing your current calculation.
		</p>
		<p>
			For example, you can begin with basic arithmetic, continue with powers or logarithms in the
			Engineering Calculator, and then evaluate trigonometric functions—all without re-entering your
			expression.
		</p>
	</section>
	<section class="card">
		<h3>What is the Quick Switch button?</h3>
		<p>The Quick Switch button provides fast access to other compatible calculators.</p>
		<p>
			It allows you to change calculators in just a few taps while preserving your current work
			whenever possible.
		</p>
	</section>
	<section class="card">
		<h3>Can I reuse previous results?</h3>
		<p>Yes.</p>
		<p>
			Open the calculation history, press and hold any result, and save it into one of the four
			memory slots.
		</p>
		<p>Stored values can later be inserted into new calculations without typing them again.</p>
	</section>
	<section class="card">
		<h3>How many memory slots are available?</h3>
		<p>The Application provides four memory slots for storing frequently used values.</p>
		<p>The stored values remain available between sessions until you replace or clear them.</p>
	</section>
	<section class="card">
		<h3>What is Calculation History?</h3>
		<p>Calculation History stores your previously completed calculations locally on your device.</p>
		<p>On the settings page, you can select the number of calculation sessions to save.</p>
		<p>You can review earlier results and reuse them in future calculations.</p>
	</section>
	<section class="card">
		<h3>Are calculations synchronized between devices?</h3>
		<p>No.</p>
		<p>All calculations remain on the device where they were created.</p>
	</section>

	<h2>Scientific and Engineer</h2>
	<section class="card">
		<h3>What can the Scientific Calculator do?</h3>
		<p>
			The Scientific Calculator includes all basic calculator features plus advanced scientific and
			engineering functions.
		</p>
		<p>See the Scientific Calculator Guide for a complete list of features and examples.</p>
		<a class="learnMore" href="{base}/engineer#instructionEngineer"
			><strong>Scientific Calculator Guide</strong></a
		>
	</section>
	<section class="card">
		<h3>Can I evaluate long expressions?</h3>
		<p>
			Yes. The Scientific Calculator can evaluate long and complex expressions in a single line. Be
			sure to use parentheses to ensure the correct order of operations.
		</p>
		<a class="learnMore" href="{base}/engineer#instructionEngineerExamples"
			><strong>View calculation examples.</strong></a
		>
	</section>
	<section class="card">
		<h3>Worked Examples.</h3>
		<p>
			Learn how to solve everyday problems such as finding the area of a circle, the volume of a
			cylinder, room dimensions, wall area, and many other calculations using the Scientific
			Calculator.
		</p>
		<ul class="mainInstr">
			<h2>More than 12 real-world calculation examples:</h2>
			<li>
				<a href="{base}/engineer/#instructionEngineerExamples"> Circumference of a Circle.</a>
			</li>

			<li>
				<a href="{base}/engineer/#AreaCircle"> Area of a Circle.</a>
			</li>

			<li>
				<a href="{base}/engineer/#ArcLengthCircle"> Arc Length of a Circle.</a>
			</li>

			<li>
				<a href="{base}/engineer#AreaRectangle"> Area of a Rectangle (or Square).</a>
			</li>

			<li>
				<a href="{base}/engineer/#PerimeterRectangle"> Perimeter of a Rectangle (or Square).</a>
			</li>

			<li>
				<a href="{base}/engineer/#AreaTriangle"> Area of a Triangle.</a>
			</li>

			<li>
				<a href="{base}/engineer/#AreaTrapezoid"> Area of a Trapezoid.</a>
			</li>

			<li>
				<a href="{base}/engineer/#VolumeRectPrism">
					Volume of a Rectangular Prism (Room or Aquarium).</a
				>
			</li>

			<li>
				<a href="{base}/engineer/#VolumeCylinder"> Volume of a Cylinder.</a>
			</li>

			<li>
				<a href="{base}/engineer/#ArithmeticMean"> Arithmetic Mean (Average).</a>
			</li>

			<li>
				<a href="{base}/engineer/#SurfAreaRectPrism">
					Surface Area of a Rectangular Prism (Walls, Floor, and Ceiling).</a
				>
			</li>

			<li>
				<a href="{base}/engineer/#Calculating the Number of Wallpaper Rolls"> CalcWallRolls.</a>
			</li>
		</ul>
	</section>

	<h2>Fractions</h2>
	<section class="card">
		<h3>How is the Fraction Calculator different?</h3>
		<p>
			Unlike many fraction calculators that require separate fields for the numerator and
			denominator, this calculator allows you to create complete expressions directly from the
			calculator's keyboard.
		</p>
		<p>See calculation examples in the Fraction Calculator Guide.</p>
		<a class="learnMore" href="{base}/fraction#instructionFraction"
			><strong>Fraction Calculator Guide.</strong></a
		>
	</section>

	<h2>Accuracy</h2>
	<section class="card">
		<h3>Can I trust the calculation results?</h3>
		<p>The Application is designed to provide accurate calculations.</p>
		<p>
			However, you should always verify important results before using them for financial,
			engineering, legal, medical, safety-critical, or other important decisions.
		</p>
	</section>
	<section class="card">
		<h3>Why can the displayed result differ slightly?</h3>
		<p>The displayed precision depends on the precision settings selected in the Application.</p>
		<p>Rounding may affect the number of visible decimal places.</p>
	</section>

	<h2>Privacy</h2>
	<section class="card">
		<h3>Where are my calculations stored?</h3>
		<p>
			Your calculations, settings, and preferences are stored locally on your device using your
			browser's local storage.
		</p>
	</section>
	<section class="card">
		<h3>Is my information sent to your servers?</h3>
		<p>No.</p>
		<p>
			Except for optional contact messages and anonymous usage statistics (if enabled), your
			calculations remain on your own device.
		</p>
	</section>
	<section class="card">
		<h3>Do you track users?</h3>
		<p>No.</p>
		<p>
			Anonymous analytics may be used only to understand overall application usage and improve
			future versions.
		</p>
		<p>Individual users are not identified.</p>
	</section>

	<h2>Future Development</h2>
	<section class="card">
		<h3>Will more calculators be added?</h3>
		<p>Yes.</p>
		<p>
			The project is continuously expanding with new mathematical, engineering, financial, date and
			time, geometry, construction, and everyday utility tools.
		</p>
	</section>
	<section class="card">
		<h3>Can I suggest a new calculator?</h3>
		<p>Absolutely.</p>
		<p>We welcome suggestions through the built-in contact form.</p>
		<p>Many new calculators are planned based on user feedback.</p>
	</section>
</main>

<style lang="scss">
	// src/styles/_homePages.scss
	.faqPage {
		color: $clr-mint-soft;
		h2 {
			font-size: 2rem;
			text-align: center;
			color: $clr-coral;
			letter-spacing: 0.2rem;
		}
	}
	.card {
		display: flex;
		flex-flow: column nowrap;
		gap: 0.5rem;

		background: $grad-btn-main;
		margin-bottom: 1.2rem;
		h3 {
			color: $clr-white;
			margin-bottom: 1rem;
		}

		&:hover {
			box-shadow: $shadow-neon-coral;
		}
	}
	.learnMore {
		align-self: flex-end;

		padding: 0.5rem 2rem;

		border-right: 2px solid rgba(255, 255, 255, 0.1);
		border-bottom: 2px solid rgba(255, 255, 255, 0.1);
		border-radius: 0.5rem;
		strong {
			color: $clr-text-main;
		}
		&:hover {
			strong {
				color: $clr-coral;
			}
			border-right: 1px double $clr-text-main;
			border-bottom: 1px double $clr-text-main;
			border-radius: 0.5rem;
			transition: all 0.35;
		}
	}
	.mainInstr {
		h2 {
			font-size: 1.2rem;
		}
		display: flex;
		flex-flow: column wrap;
		gap: 0px;
	}
</style>
