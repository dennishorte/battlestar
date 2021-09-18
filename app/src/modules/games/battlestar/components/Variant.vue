<template>
  <div class="variant-wrapper">
    <div :style="variantBackground(name)"></div>
    <div :style="variantForeground(name)">
      <slot></slot>
    </div>
  </div>
</template>


<script>
import variants from '../lib/variants.js'

export default {
  name: 'Variant',

  props: {
    name: String,
  },

  methods: {
    variantBackground(name) {
      const backgroundImage = variants.fetch(name).bgImage
      const overlayColor = variants.fetch(name).bgColor

      if (backgroundImage || overlayColor) {
        const style ={
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100%',
          height: '100%',
        }

        if (backgroundImage) {
          style.backgroundImage = `url(${backgroundImage})`
        }
        if (overlayColor) {
          style.boxShadow = `inset 0 0 0 500px ${overlayColor}`
        }

        return style
      }
      else {
        return {}
      }
    },

    variantForeground(name) {
      if (variants.fetch(name)) {
        return {
          color: variants.fetch(name).fgColor,
          position: 'relative',
        }
      }
      else {
        return {}
      }
    },

  },
}
</script>


<style scoped>
.variant-wrapper {
  position: relative;
  font-size: .85em;
  width: 100%;
  min-height: 100%;
}

.variant-wrapper > div {
  border-radius: .25em;
}
</style>
