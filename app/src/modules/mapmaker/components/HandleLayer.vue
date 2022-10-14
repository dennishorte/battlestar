<template>
  <div class="handle-layer">
    <div
      v-for="(point, index) in curveHandles"
      :key="index"
      :name="point.name"
      :curve-id="point.curveId"
      :style="handleStyle(point)"
      class="curve-handle can-drag"
    >
    </div>
  </div>
</template>


<script>
export default {
  name: 'HandleLayer',

  props: {
    curveHandles: Array,
  },

  methods: {
    handleStyle(point) {
      return {
        top: point.y + 'px',
        left: point.x + 'px',
      }
    },
  },

}
</script>


<style scoped>
.handle-layer {
  position: relative;
}

.curve-handle {
  position: absolute;
  height: 10px;
  width: 10px;
  background-color: red;
  border-radius: 50%;
  border: 1px solid black;
}
</style>
