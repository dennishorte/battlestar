<template>
  <div
    class="site-div"
    :style="loc.ui.renderStyle"
  >
    <div class="loc-name">{{ loc.name }}</div>

    <div class="troop-spaces">
      <div
        v-for="troop in loc.getTroops()"
        :key="troop.id"
        class="troop-space"
        :class="troopClasses(troop)"
      ></div>

      <div
        v-for="count in loc.getEmptySpaces()"
        :key="count"
        class="troop-space"
      ></div>
    </div>

    <div class="spy-zone">
      <div
        v-for="spy in loc.getSpies()"
        :key="spy.id"
        class="spy troop-space"
        :class="troopClasses(spy)"
      ></div>
    </div>

    <div class="points">{{ loc.points }}</div>

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
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: .5em 0;
}

.points {
  position: absolute;
  top: -.5em;
  left: -1.2em;
  background-color: white;
  border-radius: 50% 25%;
  border: 2px solid black;
  text-align: center;
  font-size: .8em;
  font-weight: 500;
  height: 1.8em;
  width: 1.8em;
}

.spy-zone {
  position: absolute;
  top: 0;
  right: -1em;
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
  line-height: 1em;
}

.selected {
  box-shadow: 0 0 4px 4px cyan;
}
</style>
