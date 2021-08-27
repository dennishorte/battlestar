<template>
<div class="space-zone">

  <b-row no-gutters>
    <b-col class="space-menu" cols="2">
      <div class="space-components">
        <div class="galactica-components">
          <div
            v-for="c in galacticaComponents"
            :key="c.name"
            @click="clickComponent($event, c)">

            {{ c.name }}
          </div>
        </div>

        <div class="cylon-components">
          <div
            v-for="c in cylonComponents"
            :key="c.name"
            @click="clickComponent($event, c)">

            {{ c.name }}
          </div>
        </div>
      </div>

      <div class="space-components-clear">
        <b-button @click="clearSpaceComponents">
          clear
        </b-button>
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

        <b-col class="space-galactica" cols="2">
          galactica
        </b-col>

        <SpaceRegion :index="2" />
      </b-row>

      <b-row no-gutters>
        <b-col class="space-remover-wrapper" cols="1">
          <div
            @click="spaceComponentRemove"
            class="space-remover">
            remover
          </div>
        </b-col>
        <SpaceRegion :index="4" />
        <SpaceRegion :index="3" />
      </b-row>

    </b-col>
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
  },

  methods: {
    clearSpaceComponents() {
      this.$emit('space-components-clear')
    },

    clickComponent(event, component) {
      this.$store.commit('bsg/spaceComponentGrab', {
        component: component.name,
        source: 'supply',
        message: `Holding ${component.name} from supply`,
      })
    },

    spaceComponentRemove() {
      console.log('spaceComponentRemove')
    },
  }
}
</script>

<style scoped>
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
    justify-content: space-between;
}

.space-remover-wrapper {
    padding: .25em!important;
}

.space-remover {
    color: #ccd;
    background-color: #dde;
    border: 1px solid #bbb;
    border-radius: 100% 100%;
    flex-grow: 1;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
}

.space-remover-drop {
    border-color: red;
    color: #fff;
    background-color: #fbb;
}

.space-zone {
    background-color: #abd;
    padding: .5em;
}
</style>
