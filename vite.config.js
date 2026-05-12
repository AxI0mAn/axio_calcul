import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path';
import autoprefixer from 'autoprefixer';
import { SvelteKitPWA } from '@vite-pwa/sveltekit'; // 1. Импортируем плагин

export default defineConfig({
	plugins: [
		sveltekit(),
		// 2. Настройка PWA
		SvelteKitPWA({
			registerType: 'autoUpdate', // Автоматическое обновление без перезагрузки вручную
			manifest: false,            // Используем твой manifest.json из static
			workbox: {
				// Кэшируем все важные файлы
				globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,json}'],
				// Чистим старый кэш автоматически
				cleanupOutdatedCaches: true,
				// Настройка для GitHub Pages (чтобы не было проблем с путями)
				navigateFallback: './index.html',
			},
			devOptions: {
				enabled: true,
				type: 'module', // Важно для Svelte 5
				suppressWarnings: true,
				navigateFallbackAllowlist: [/^\/$/], // Позволяет корректно работать на главной
			},
		})
	],

	resolve: {
		alias: {
			'$utils': path.resolve('./src/lib/components/utils'),
		},
	},

	server: {
		watch: {
			ignored: ['**/node_modules/**']
		}
	},

	css: {
		postcss: {
			plugins: [
				autoprefixer({
					overrideBrowserslist: ['last 2 versions', 'not dead']
				})
			],
		},

		preprocessorOptions: {
			scss: {
				additionalData: `
          @use "${path.resolve('src/styles/variables').replace(/\\/g, '/')}" as *;
          @use "${path.resolve('src/styles/mixins').replace(/\\/g, '/')}" as *;
        `
			}
		},

		modules: {
			localsConvention: 'camelCase',
			generateScopedName: '[name]__[local]--[hash:base64:5]',
		},
	},
});