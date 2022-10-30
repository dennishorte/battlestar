<template>
  <li ref="li">
    <slot></slot>
  </li>
</template>


<script>
export default {
  name: 'DropdownItem',

  mounted() {
    const links = this.$refs.li.querySelectorAll('a')
    for (const link of links) {
      link.classList.add('dropdown-item')
    }
  },
}
</script>
