<template>
  <div
    class="path-div"
    :class="dynamicClasses"
    :style="loc.ui.renderStyle"
    @click="click"
  >

    <div class="troop-spaces">
      <div
        v-for="(troop, index) in loc.getTroops()"
        :key="index"
        class="troop-space"
        :class="troopClasses(troop)"
        :style="troopStyles(troop)"
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
.path-div {
  display: flex;
  justify-content: center;
  align-items: center;
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

.loc-name {
  font-size: .7em;
  text-align: center;
}

.selected {
  box-shadow: 0 0 4px 4px #cc99ff;
}
</style>
