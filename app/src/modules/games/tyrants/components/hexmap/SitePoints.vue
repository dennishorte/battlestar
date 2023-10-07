<template>
  <rect
    :x="left"
    :y="top"
    :rx="radius - 4"
    :ry="radius"
    :width="radius * 2"
    :height="radius * 2"
    fill="white"
    stroke="black"
    stroke-width="2" />
  />

  <text :x="left + radius" :y="top + radius + 3" class="points-text">{{ value }}</text>
</template>


<script>
export default {
  name: 'SitePoints',

  props: {
    cx: Number,
    cy: Number,
    value: Number,
  },

  data() {
    return {
      radius: 8,
    }
  },

  computed: {
    left() { return this.cx - this.radius + 2 },
    top() { return this.cy - this.radius + 2 },
  },
}

</script>


<style scoped>
.points-container {
  rx: 5;
  ry: 5;
  width: 10;
  height: 10;
  fill: white;
  stroke: black;
  stroke-width: 2;

}

.points-text {
  fill: black;
  font-size: 10px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: lighter;
  text-anchor: middle;
}
</style>
