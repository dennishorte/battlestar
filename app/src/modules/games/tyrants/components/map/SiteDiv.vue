<template>
  <div
    class="site-div"
    :class="dynamicClasses"
    :style="loc.ui.renderStyle"
    @click="click"
  >
    <div class="loc-name">{{ loc.name() }}</div>

    <div class="troop-spaces">
      <div
        v-for="troop in loc.getTroops()"
        :key="troop.id"
        class="troop-space"
        :style="ui.fn.troopStyle(troop)"
      />

      <div
        v-for="count in loc.getEmptySpaces()"
        :key="count"
        class="troop-space"
      />
    </div>

    <div class="spy-zone">
      <div
        v-for="spy in loc.getSpies()"
        :key="spy.id"
        class="spy troop-space"
        :style="ui.fn.troopStyle(spy)"
      />
    </div>

    <div class="points">{{ loc.points }}</div>

  </div>
</template>


<script>
export default {
  name: 'SiteDiv',

  inject: ['game', 'ui'],

  props: {
    loc: {
      type: Object,
      required: true
    },
  },

  computed: {
    dynamicClasses() {
      const classes = []
      if (this.ui.selectable.includes(this.loc.name())) {
        classes.push('selected')
      }

      return classes
    },
  },

  methods: {
    click() {
      this.ui.fn.clickLocation(this.loc)
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
  top: -.6em;
  left: -.7em;
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
  flex-wrap: wrap;
}

.loc-name {
  font-size: .7em;
  text-align: center;
  line-height: 1em;
}

.selected {
  box-shadow: 0 0 4px 4px #cc99ff;
}
</style>
