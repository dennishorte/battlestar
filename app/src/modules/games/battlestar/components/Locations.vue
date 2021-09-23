<template>
  <b-row class="locations">

    <b-col cols="5">
      <div v-for="area in areas" :key="area">
        <div class="heading">{{ area }}</div>
        <div
          v-for="loc in filtered(area)"
          :key="loc.name"
          @click="selectLocation(loc.name)"
          class="loc-name">
          {{ loc.name }}
        </div>
      </div>
    </b-col>


    <b-col>
      <template v-if="!!selected.name">
        <div class="heading">Name </div>{{ selected.name }}
        <div class="heading">Text</div>
        <div>{{ selected.text }}</div>
        <div v-if="selected.hazardous" class="heading">
          Hazardous!
        </div>

        <div v-if="!!selected['skill check value']" class="skill-check">
          <hr />
          <div class="heading">Skill Check</div>
          <div>
            <span class="heading">Value: </span>{{ selected['skill check value'] }}
          </div>
          <template v-for="skill in skillList">
            <SkillLink v-if="selected[skill]" :skillName="skill" :key="skill" />
          </template>
        </div>

      </template>
    </b-col>

  </b-row>
</template>


<script>
import { skillList } from '../lib/util.js'

import SkillLink from './SkillLink'

export default {
  name: 'Locations',

  components: {
    SkillLink,
  },

  data() {
    return {
      selectedLocation: {},
      skillList,
    }
  },

  watch: {
    infoRequest(oldName, newName) {
      console.log('infoRequest watcher', oldName, newName)
      if (newName) {
        this.selectLocation(newName)
      }
    },
  },

  computed: {
    areas() {
      const accumulator = {}
      for (const loc of this.locations) {
        accumulator[loc.area] = 1
      }
      return Object.keys(accumulator)
    },

    infoRequest() {
      return this.$store.getters['bsg/uiModalLocation'].name
    },

    locations() {
      return this.$store.getters['bsg/dataLocations']
    },

    selected() {
      const requestedName = this.$store.getters['bsg/uiModalLocation'].name
      if (requestedName) {
        this.selectLocation(requestedName)
      }
      return this.selectedLocation
    },
  },

  methods: {
    filtered(area) {
      return this.locations
                 .filter(l => l.area === area)
                 .sort((l, r) => l.name.localeCompare(r.name))
    },

    selectLocation(name) {
      this.selectedLocation = this.locations.find(l => l.name === name)
    },
  },
}
</script>


<style scoped>
.loc-name {
  margin-left: .5em;
  font-size: .7em;
  line-height: 1.4rem;
}

.skill-link {
  margin-bottom: .25em;
}
</style>
