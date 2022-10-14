<template>
  <div class="div-layer">
    <div
      v-for="div in styledDivs"
      :key="div.id"
      :style="div.renderStyle"
      :id="div.id"
      can-select="true"
      can-connect="true"
      can-drag="true"
    >
    </div>
  </div>
</template>


<script>
export default {
  name: 'DivLayer',

  props: {
    styledDivs: Array,
  },
}
</script>


<style scoped>
.div-layer {
  position: relative;
}

.selected {
  box-shadow: 0 0 4px 4px cyan;
}
</style>
