<template>
  <li>
    <button class="dropdown-item" :disabled="disabled">
      <slot></slot>
    </button>
  </li>
</template>


<script>
export default {
  name: 'DropdownButton',

  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
