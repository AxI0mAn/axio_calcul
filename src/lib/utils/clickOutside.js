/**
 * src/lib/utils/clickOutside.js
 * отслеживает клик вне элемента
 */

export function clickOutside(node, callback) {
  const handleClick = (event) => {
    // console.log("click detected:", event.target);
    if (!node.contains(event.target)) {
      callback();
    }
  };

  document.addEventListener('click', handleClick, true);
  return {
    destroy() {
      document.removeEventListener('click', handleClick, true);
    }
  };
}

/**
 * Использование в компоненте
<script>
    import { clickOutside } from './actions/clickOutside.js';

    let isOpen = false;


    function close() { // для NavBar
    console.log('MENU CLOSED');
    isMenuOpen = false;
    openLvl1 = false;
    openLvl2 = false;
  }
    function close() { // для NavBurger
    console.log('MENU CLOSED');
    menuOpen = false;
  }

</script>

<div use:clickOutside={close} class="menu-wrapper">
    <!-- меню -->
</div>
 */