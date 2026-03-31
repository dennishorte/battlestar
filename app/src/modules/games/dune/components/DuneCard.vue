<template>
  <div class="dune-card" :class="cardClasses">
    <span class="card-icons" v-if="icons.length">
      <span v-for="icon in icons"
            :key="icon"
            class="icon"
            :class="`icon-${icon}`">{{ iconLabel(icon) }}</span>
    </span>
    <span class="card-name">{{ card.name }}</span>
    <span class="card-cost" v-if="card.persuasionCost">{{ card.persuasionCost }}</span>
  </div>
</template>


<script>
export default {
  name: 'DuneCard',

  props: {
    card: {
      type: Object,
      required: true,
    },
  },

  computed: {
    cardClasses() {
      const classes = []
      const def = this.card.data || this.card
      if (def.factionAffiliation) {
        classes.push(`faction-${def.factionAffiliation}`)
      }
      return classes
    },

    icons() {
      const def = this.card.data || this.card
      return def.agentIcons || []
    },
  },

  methods: {
    iconLabel(icon) {
      const labels = {
        green: 'G',
        purple: 'P',
        yellow: 'Y',
        emperor: 'E',
        guild: 'Gu',
        'bene-gesserit': 'BG',
        fremen: 'F',
      }
      return labels[icon] || icon[0].toUpperCase()
    },
  },
}
</script>


<style scoped>
.dune-card {
  display: inline-flex;
  align-items: center;
  gap: .3em;
  padding: .15em .5em;
  border-radius: .2em;
  background-color: #2a2318;
  border: 1px solid #4a3c28;
  font-size: .85em;
  margin: 1px;
}

.card-name {
  color: #e8dcc8;
}

.card-cost {
  color: #e8a83e;
  font-weight: bold;
  font-size: .85em;
}

.card-icons {
  display: inline-flex;
  gap: 1px;
}

.icon {
  display: inline-block;
  width: 1.3em;
  height: 1.3em;
  line-height: 1.3em;
  text-align: center;
  border-radius: 50%;
  font-size: .7em;
  font-weight: bold;
  color: white;
}

.icon-green { background-color: #3a7d3a; }
.icon-purple { background-color: #6a3d8a; }
.icon-yellow { background-color: #b8860b; }
.icon-emperor { background-color: #8b2020; }
.icon-guild { background-color: #c07020; }
.icon-bene-gesserit { background-color: #5b3a8a; }
.icon-fremen { background-color: #2a6090; }

.faction-emperor { border-color: #8b2020; }
.faction-guild { border-color: #c07020; }
.faction-bene-gesserit { border-color: #5b3a8a; }
.faction-fremen { border-color: #2a6090; }
</style>
