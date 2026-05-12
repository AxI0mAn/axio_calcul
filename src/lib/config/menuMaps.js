// src/lib/config/menuMaps.js
/**
 * Это Реестр существующих вариантов страниц для каждой группы страниц для переключения в <details> в правом верхнем углу - как быстрый переход к другому калькулятору внутри группы
 * инструкция в /home/daxio/Desktop/Link to Projects/svelte5doc/assets/CODING/Система динамических меню и анимаций.docx
*/

import mathBasicWebp from '$lib/assets/iconPng/64/png_math_basic.webp';
import mathBasicJpeg from '$lib/assets/iconPng/64/png_math_basic.jpeg';
import mathEngineerWebp from '$lib/assets/iconPng/64/png_math_engineer.webp';
import mathEngineerJpeg from '$lib/assets/iconPng/64/png_math_engineer.jpeg';
import mathTrigonometryWebp from '$lib/assets/iconPng/64/png_math_trigonometry.webp';
import mathTrigonometryJpeg from '$lib/assets/iconPng/64/png_math_trigonometry.jpeg';


export const menuMaps = {
  math: [
    {
      name: 'BASIC', // ДОЛЖЕН СОВПАДАТЬ С 	appState.now_mode = 'BASIC'; НА СТРАНИЦЕ src/routes/(math)/basic/+page.svelte
      href: '/basic',
      img: {
        webp: mathBasicWebp,
        jpeg: mathBasicJpeg
      }
    },
    {
      name: 'ENGINEER',
      href: '/engineer',
      img: {
        webp: mathEngineerWebp,
        jpeg: mathEngineerJpeg
      }
    },
    {
      name: 'TRIGONOMETRY',
      href: '/trigonometry',
      img: {
        webp: mathTrigonometryWebp,
        jpeg: mathTrigonometryJpeg
      }
    },
  ],
  geometry: []
};