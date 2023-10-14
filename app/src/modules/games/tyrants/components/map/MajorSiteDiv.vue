<template>
  <div
    class="major-site-div"
    :class="dynamicClasses"
    :style="loc.ui.renderStyle"
    @click="click"
  >
    <div class="loc-name">{{ loc.name }}</div>

    <div class="troop-spaces">
      <div
        v-for="troop in loc.getTroops()"
        :key="troop.id"
        class="troop-space"
        :class="troopClasses(troop)"
        :style="troopStyles(troop)"
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
        :style="troopStyles(spy)"
      ></div>
    </div>

    <div class="control-marker">
      {{ loc.totalControl.influence }} / {{ loc.totalControl.points }}
    </div>

    <div class="points">{{ loc.points }}</div>

  </div>
</template>


<script>
export default {
  name: 'MajorSiteDiv',

  inject: ['game', 'ui'],

  props: {
    loc: Object,
  },

  computed: {
    dynamicClasses() {
      const classes = []
      if (this.ui.selectable.includes(this.loc.name)) {
        classes.push('selected')
      }

      return classes
    },
  },

  methods: {
    click() {
      this.ui.fn.clickLocation(this.loc)
    },

    troopClasses(troop) {
      const classes = []

      if (!this.game.settings.chooseColors) {
        const color = this.ui.fn.getTroopColor(this.game, troop)
        classes.push(`${color}-element`)
      }

      return classes
    },

    troopStyles(troop) {
      if (this.game.settings.chooseColors) {
        const player = this.game.getPlayerByCard(troop)
        if (player) {
          return { 'background-color': player.color }
        }
        else {
          return { 'background-color': 'gray' }
        }
      }
    },
  },
}
</script>


<style scoped>
.major-site-div {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: .5em 0;
}

.control-marker {
  font-size: .8em;
  text-align: center;
}

.loc-name {
  margin-top: 2em;
}

.points {
  position: absolute;
  top: .4em;
  left: .4em;
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
  margin-bottom: .5em;
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
