import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path';
import autoprefixer from 'autoprefixer';

export default defineConfig({
	plugins: [sveltekit()],

	resolve: {
		alias: {
			'$utils': path.resolve('./src/lib/components/utils'),
		},
	},

	// ДЛЯ УСКОРЕНИЯ горячей перезагрузки модулей (HMR - Hot Module Replacement), 
	// вызванный проблемами с файловым наблюдателем (File Watcher) 
	// или недостаточной производительностью компиляции.
	server: {
		watch: {
			ignored: ['**/node_modules/**']
		}
	},

	css: {
		// PostCSS для Autoprefixer
		// Пример для более широкой поддержки	для древних браузеров 
		// overrideBrowserslist: ['> 0.5%', 'last 4 versions', 'Firefox ESR']
		postcss: {
			plugins: [
				autoprefixer({
					overrideBrowserslist: ['last 2 versions', 'not dead']
				})],
		},

		// Настройка SCSS препроцессора
		preprocessorOptions: {
			scss: {
				// Глобальные переменные SCSS
				// Этот файл будет автоматически импортирован во все Svelte-компоненты
				// БЕЗ необходимости писать @import ... в каждом файле.
				// НО если ты поместишь _reset.scss или _layout.scss СЮДА, ТО вес твоего CSS вырастет в десятки раз.
				// ДЛЯ _reset.scss и _layout.scss ИМПОРТИРУЙ В src/styles/app.scss, КОТОРЫЙ ИМПОРТИРУЕТСЯ В src/routes/+layout.svelte
				additionalData: `@use '/src/styles/_variables.scss'; @use '/src/styles/_mixins.scss';`
			}
		},

		// 3. Настройка CSS Modules (опционально)
		modules: {
			localsConvention: 'camelCase',
			generateScopedName: '[name]__[local]--[hash:base64:5]',
		},
	},
});