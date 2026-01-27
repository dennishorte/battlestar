<template>
  <span class="option-name" :class="{ 'has-component': !!componentAndProps }">
    <component
      v-if="!!componentAndProps"
      :is="componentAndProps.c"
      v-bind="componentAndProps.p"
    />

    <span v-else>
      {{ displayName }}
    </span>
  </span>
</template>


<script>
export default {
  name: 'OptionName',

  inject: ['ui'],

  props: {
    option: {
      type: [Object, String],
      default: ''
    }
  },

  computed: {
    componentAndProps() {
      if (this.ui.fn.selectorOptionComponent) {
        const result = this.ui.fn.selectorOptionComponent(this.option)

        if (result) {
          return {
            c: result.component,
            p: result.props,
          }
        }
      }

      return undefined
    },

    displayName() {
      return this.option.title ? this.option.title : this.option
    },
  },
}
</script>


<style scoped>
.option-name {
  font-size: 1.1em;
}

.option-name.has-component {
  display: block;
  width: 100%;
}
</style>
