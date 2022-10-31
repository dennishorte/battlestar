<template>
  <div class="dropdown">
    <button
      class="btn btn-secondary dropdown-toggle"
      :class="sizeClass"
      data-bs-toggle="dropdown"
    >
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

    size: {
      type: String,
      default: '',
    },
  },

  computed: {
    sizeClass() {
      if (this.size === 'sm') return 'btn-sm'
      if (this.size === 'lg') return 'btn-lg'
      return ''
    }
  },
}
</script>


<style scoped>
</style>
