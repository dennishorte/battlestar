<template>
  <div class="dropdown">
    <button class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown">
      <slot name="title">
        <template v-if="!notitle">menu</template>
      </slot>
    </button>

    <ul class="dropdown-menu">
      <slot></slot>
    </ul>
  </div>
</template>


<script>
export default {
  name: 'Dropdown',

  props: {
    notitle: {
      type: Boolean,
      default: false
    },
  },
}
</script>


<style scoped>
</style>
