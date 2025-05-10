<template>
  <div class="cube-breakdown-mana-cost-divider">
    <span class="bar"/>

    <span v-for="dot in dots" :class="dot"/>

    <span class="bar"/>
  </div>
</template>


<script>
export default {
  name: 'CubeBreakdownManaCostDivider',

  props: {
    cost: Number,
  },

  computed: {
    dots() {
      const count = Math.min(this.cost, 10)

      const output = []
      for (let i = 0; i < count; i++) {
        if (i % 5 === 4) {
          output.push('small-dot')
        }
        else {
          output.push('tiny-dot')
        }
      }
      return output
    },
  },
}
</script>


<style scoped>
.cube-breakdown-mana-cost-divider {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: .25em;
}

.bar {
  height: 1px;
  width: 100%;
  background-color: gray;
  display: inline-block;
  margin: 0 2px;
  padding: 0;
  flex-grow: 1;
}

.small-dot {
  height: 3px;
  width: 3px;
  background-color: black;
  border-radius: 50%;
  display: inline-block;
  margin: 0 2px;
  padding: 0;
  flex-shrink: 0;
}

.tiny-dot {
  height: 2px;
  width: 2px;
  background-color: black;
  border-radius: 50%;
  display: inline-block;
  margin: 0 2px;
  padding: 0;
  flex-shrink: 0;
}
</style>
