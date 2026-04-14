import adapter from '@sveltejs/adapter-static'; // Импортируем адаптер для статического SPA размещенного на gitHub
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'; // <-- Импортируем для работы с SCSS

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Активация Runes Mode (Svelte 5)
	compilerOptions: {
		runes: true,
	},

	// Добавляем секцию preprocess и используем vitePreprocess()
	preprocess: vitePreprocess(), // <-- Используем

	kit: {
		adapter: adapter({
			fallback: '200.html', // Для SPA на GH Pages
			// Настройка папок вывода (по умолчанию 'build', но лучше явно указать)
			// Куда поместить сгенерированные HTML-страницы
			pages: 'build',
			// Куда поместить статические ресурсы (CSS, JS, картинки)
			assets: 'build',
		}),
		paths: {
			base: process.env.VITE_BASE_PATH || '', // Имя репозитория возьмёт GH Pages при сборке с помощью Actions

			//base: process.env.NODE_ENV === 'production' ? '/axio_calcul' : '', // Если мы на GitHub Pages (production), добавляем имя репозитория
		},

		prerender: { // Для статического сайта на GitHub Pages эта настройка обязательна, чтобы SvelteKit обнаружил и сгенерировал все страницы вашего приложения.
			entries: ['*']
		}
	}
};
export default config;