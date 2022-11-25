<template>
  <div class="dropdown">
    <button
      class="btn btn-light dropdown-toggle"
      :class="sizeClass"
      data-bs-toggle="dropdown"
    >
    </button>

    <ul class="dropdown-menu dropdown-menu-end">
      <slot></slot>
    </ul>
  </div>
</template>


<script>
export default {
  name: 'TableauZoneMenu',

  props: {
  },

  computed: {
  },
}
</script>


<style scoped>
</style>
