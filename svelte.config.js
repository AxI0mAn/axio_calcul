import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// 1. Включаем поддержку Runes Svelte 5
	compilerOptions: {
		runes: true,
	},

	// 2. Препроцессор для работы со стилями (SCSS/PostCSS)
	preprocess: vitePreprocess(),

	kit: {
		// 3. Настройка статического адаптера
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: '404.html', // Обязательно для SPA на GitHub Pages
			precompress: false,
			strict: true,
		}),

		// 4. Управление путями синхронно с логикой
		paths: {
			base: process.env.NODE_ENV === 'production' ? '/axio_calcul' : '',
		},

		// 5. Конфигурация пререндера
		prerender: {
			entries: ['*'], // SvelteKit сам найдет все ссылки
			handleHttpError: 'warn' // Позволяет собрать билд при наличии "битых" ссылок
		}
	}
};

export default config;