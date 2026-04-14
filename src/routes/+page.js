export const prerender = true;  // для сборки файла index.html

import { redirect } from '@sveltejs/kit';
import { base } from '$app/paths';

export function load() {
  // Автоматически перенаправляем с /axio_calcul/ на /axio_calcul/en/
  throw redirect(307, `${base}/en`);
}