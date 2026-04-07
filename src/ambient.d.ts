// Объявляем модули для всех статических ассетов, которые мы импортируем.
// Мы говорим TypeScript, что импорт этих файлов вернет строковое значение (URL).

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

// 1. Для импорта SVG как строки (через {@html ...})
declare module '*.svg?raw' {
  const content: string;
  export default content;
}

// 2. Для импорта SVG как Svelte-компонента (через <Icon />)
declare module '*.svg?svelte' {
  import type { Component } from 'svelte';
  const component: Component<any>;
  export default component;
}

// 3. Базовая декларация для обычных импортов SVG
declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.json' {
  const value: any;
  export default value;
}
// Добавьте сюда любые другие форматы, которые вы планируете импортировать (например, .mp4, .json)