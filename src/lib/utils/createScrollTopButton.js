/**
 * Создает футуристичную кнопку "Вверх"
 * генерирует DOM-элемент и использует IntersectionObserver для слежения за появлением якоря.
 * @param {string} anchorId - ID элемента, за которым следим (якорь)
 */

/* Применение 

<script>
  import { onMount } from 'svelte';
  import { createScrollTopButton } from '$lib/utils/scrollTop.js';

  onMount(() => {
    // В качестве якоря передаем ID элемента в самом верху страницы
    // (например, логотип или пустой div в начале body)
    createScrollTopButton('top-anchor');
  });
</script>

<div id="top-anchor"></div>

<main>
  </main>

*/
export function createScrollTopButton(anchorId) {
  const btn = document.createElement('button');

  // Уменьшенная стрелка для маленькой кнопки
  btn.innerHTML = `
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 15l-6-6-6 6"/>
    </svg>
  `;

  // Стили: круг и размер 40x40
  Object.assign(btn.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '40px',
    height: '40px',
    backgroundColor: '#0284c7',
    border: 'none',
    borderRadius: '50%', // Идеальный круг
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 0.3s, transform 0.3s, visibility 0.3s',
    opacity: '0',
    visibility: 'hidden',
    zIndex: '1000',
    boxShadow: '0 4px 12px rgba(100, 116, 139, 0.4), inset 0 2px 4px rgba(255,255,255,0.3)',
    transform: 'scale(0.05)',
    outline: 'none'
  });

  const hideBtn = () => {
    btn.style.opacity = '0';
    btn.style.visibility = 'hidden';
    btn.style.transform = 'scale(0.05)';
  };

  const showBtn = () => {
    btn.style.opacity = '1';
    btn.style.visibility = 'visible';
    btn.style.transform = 'scale(1)';
  };

  // ЛОГИКА НАЖАТИЯ: Скрываем мгновенно, не дожидаясь обсервера
  btn.onclick = () => {
    hideBtn();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const anchor = document.getElementById(anchorId);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Если якорь виден — скрываем, если нет — показываем
      entry.isIntersecting ? hideBtn() : showBtn();
    });
  }, { threshold: 0 });

  if (anchor) observer.observe(anchor);
  document.body.appendChild(btn);

  // ВОЗВРАЩАЕМ ФУНКЦИЮ ОЧИСТКИ
  return () => {
    observer.disconnect(); // Останавливаем слежку
    if (btn.parentNode) {
      btn.parentNode.removeChild(btn); // Удаляем кнопку из HTML
    }
  };
}