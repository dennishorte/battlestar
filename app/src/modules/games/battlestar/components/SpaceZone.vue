<template>
  <div class="space-zone">

    <b-row no-gutters>
      <b-col class="space-menu" cols="3">
        <div @click="clickComponent('viper')">
          <div>Viper</div>
          <div class="ship-stats">
            m{{ status.viper.max }} dm{{ status.viper.damaged }}
            d{{ status.viper.destroyed }} p{{ status.viper.piloted }}
          </div>
        </div>

        <div @click="clickComponent('civilian')">
          <div>Civilian</div>
          <div class="ship-stats">
            remaining
          </div>
        </div>

        <div @click="clickComponent('basestarA')">
          <div>Basestar A</div>
          <div class="ship-stats">
            <div v-if="status.basestarA.damage.length === 0">
              undamaged
            </div>
            <template v-else>
              <div v-for="dmg in status.basestarA.damage" :key="dmg">
                {{ dmg }}
              </div>
            </template>
          </div>
        </div>

        <div @click="clickComponent('basestarB')">
          <div>Basestar B</div>
          <div class="ship-stats">
            <div v-if="status.basestarB.damage.length === 0">
              undamaged
            </div>
            <template v-else>
              <div v-for="dmg in status.basestarB.damage" :key="dmg">
                {{ dmg }}
              </div>
            </template>
          </div>
        </div>

        <div @click="clickComponent('raider')">
          Raiders
        </div>

        <div @click="clickComponent('heavyRaider')">
          Heavys
        </div>

      </b-col>

      <b-col class="space-regions">

        <b-row no-gutters>
          <b-col cols="1"></b-col>
          <SpaceRegion :index="0" />
          <SpaceRegion :index="1" />
        </b-row>

        <b-row no-gutters>
          <SpaceRegion :index="5" />

          <b-col @click="clickComponent('galactica')" class="space-galactica" cols="2">
            galactica
          </b-col>

          <SpaceRegion :index="2" />
        </b-row>

        <b-row>
          <b-col cols="1"></b-col>
          <SpaceRegion :index="4" />
          <SpaceRegion :index="3" />
        </b-row>

      </b-col>
    </b-row>



    <b-row no-gutters>
      <div class="space-components-clear">
        <b-button @click="clearSpaceComponents">
          clear
        </b-button>
      </div>

      <div
        @click="spaceComponentRemove"
        :class="[grabbing ? 'drop-highlight' : '']"
        class="space-dropper">
        remover
      </div>

      <div
        @click="spaceComponentDamage"
        :class="[grabbing ? 'drop-highlight' : '']"
        class="space-dropper">
        damage
      </div>

      <div
        @click="spaceComponentDestroy"
        :class="[grabbing ? 'drop-highlight' : '']"
        class="space-dropper">
        destroy
      </div>
    </b-row>


  </div>
</template>


<script>
import SpaceRegion from "./SpaceRegion"

const components = [
  {
    name: 'raptor',
    faction: 'galactica',
  },
  {
    name: 'viper',
    faction: 'galactica',
  },
  {
    name: 'civilian',
    faction: 'galactica',
  },
  {
    name: 'basestar',
    faction: 'cylon',
  },
  {
    name: 'raider',
    faction: 'cylon',
  },
  {
    name: 'heavy raider',
    faction: 'cylon',
  },
]


export default {
  name: 'SpaceZone',

  components: {
    SpaceRegion,
  },

  data() {
    return {
      components,
    }
  },

  computed: {
    cylonComponents() {
      return components.filter(c => c.faction === 'cylon')
    },
    galacticaComponents() {
      return components.filter(c => c.faction === 'galactica')
    },
    grabbing() {
      return this.$store.getters['bsg/spaceComponentGrabbing']
    },
    status() {
      return this.$store.state.bsg.game.space.ships
    },
  },

  methods: {
    clearSpaceComponents() {
      this.$store.commit('bsg/spaceComponentsClear')
    },

    clickComponent(component) {
      this.$store.commit('bsg/spaceComponentGrab', {
        component: component,
        source: 'supply',
        message: `Holding ${component} from supply`,
      })
    },

    spaceComponentDamage() {
      this.$store.commit('bsg/spaceComponentDamage')
    },

    spaceComponentDestroy() {
      this.$store.commit('bsg/spaceComponentDestroy')
    },

    spaceComponentRemove() {
      this.$store.commit('bsg/spaceComponentRemove')
    },
  }
}
</script>

<style scoped>
.ship-stats {
  color: #333;
  font-size: .7em;
}

.space-galactica {
  border: 1px solid #ddd;
  border-radius: 8em/1.5em;
  background-color: #777;

  display: flex;
  justify-content: center;
  align-items: center;
}

.space-menu {
  display: flex;
  flex-direction: column;
}

.space-remover-wrapper {
  padding: .25em!important;
}

.space-dropper {
  color: #ccd;
  background-color: #dde;
  border: 1px solid #bbb;
  border-radius: 100% 100%;
  flex-grow: 1;
  height: 3em;

  display: flex;
  justify-content: center;
  align-items: center;
}

.drop-highlight {
  border-color: #fcc;
  color: #fff;
  background-color: #f55;
  box-shadow: inset 10px 10px 20px #f99, inset -10px -10px 20px #f99;
}

.space-zone {
  background-color: #abd;
  padding: .5em;
}
</style>
