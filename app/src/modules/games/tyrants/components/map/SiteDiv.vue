<template>
  <div
    class="site-div"
    :style="loc.ui.renderStyle"
  >
    <div class="loc-name">{{ loc.name }}</div>

    <div class="troop-spaces">
      <div
        v-for="(troop, index) in loc.getTroops()"
        :key="index"
        class="troop-space"
        :class="troopClasses(troop)"
      ></div>

      <div
        v-for="count in loc.getEmptySpaces()"
        :key="count + 100"
        class="troop-space"
      ></div>
    </div>

  </div>
</template>


<script>
export default {
  name: 'SiteDiv',

  inject: ['game', 'ui'],

  props: {
    loc: Object,
  },

  computed: {
  },

  methods: {
    troopClasses(troop) {
      const classes = []

      const color = this.ui.fn.getTroopColor(this.game, troop)
      classes.push(`${color}-troop`)

      return classes
    },
  },
}
</script>


<style scoped>
.site-div {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.troop-spaces {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.troop-space {
  height: 1.2em;
  width: 1.2em;
  border-radius: 50%;
  border: 1px solid black;
  margin: 1px;
}

.neutral-troop {
  background-color: gray;
}

.red-troop {
  background-color: red;
}

.blue-troop {
  background-color: blue;
}

.green-troop {
  background-color: green;
}

.yellow-troop {
  background-color: yellow;
}

.loc-name {
  font-size: .7em;
  text-align: center;
}

.selected {
  box-shadow: 0 0 4px 4px cyan;
}
</style>
