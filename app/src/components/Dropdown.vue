<template>
  <div class="dropdown">
    <button
      class="btn btn-secondary dropdown-toggle"
      :class="buttonClasses"
      data-bs-toggle="dropdown"
      @click.stop
    >
      <slot name="title">
        <template v-if="!notitle">menu</template>
      </slot>
    </button>

    <ul class="dropdown-menu" :class="listClasses">
      <slot/>
    </ul>
  </div>
</template>


<script>
export default {
  name: 'Dropdown',

  props: {
    menuEnd: {
      type: Boolean,
      default: false,
    },

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
    buttonClasses() {
      const classes = []

      if (this.size === 'sm') {
        classes.push('btn-sm')
      }
      if (this.size === 'lg') {
        classes.push('btn-lg')
      }

      return classes
    },

    listClasses() {
      const classes = []

      if (this.menuEnd) {
        classes.push('dropdown-menu-end')
      }

      return classes
    },
  },
}
</script>


<style scoped>
</style>
