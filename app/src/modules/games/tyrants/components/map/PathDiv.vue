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
        :class="{ 'unit-selected': ui.fn.isUnitSelectable(troop, loc) }"
        :style="this.ui.fn.troopStyle(troop)"
        @click="ui.fn.clickTroop(troop, loc, $event)"
      />
    </div>

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

.loc-name {
  font-size: .7em;
  text-align: center;
}

.selected {
  box-shadow: 0 0 4px 4px #cc99ff;
}
</style>
