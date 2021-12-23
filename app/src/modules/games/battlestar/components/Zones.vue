<template>
  <div class="zones">

    <b-row>
      <b-col>

        <div class="heading">
          Players
        </div>
        <div
          v-for="name in playerNames"
          :key="name"
        >
          <DeckZone
            :name="name"
            :deck-name="`players.${name}`"
            :expanded="true"
            :sort="handSort"
            :variant-dynamic="activePlayerVariantFunc(name)"
          />
        </div>

      </b-col>
      <b-col>

        <div class="heading">
          Skill Decks
        </div>
        <div
          v-for="name in skillList"
          :key="name"
        >
          <DeckZone
            :name="name"
            :deck-name="`decks.${name}`"
            :variant="name"
          />
        </div>

      </b-col>
    </b-row>

    <b-row>
      <b-col>

        <div class="heading">
          Open
        </div>
        <DeckZone name="Keep" deck-name="keep" :expanded="true" />
        <DeckZone name="Common" deck-name="common" :expanded="true" />
        <DeckZone name="Exile" deck-name="exile" />

      </b-col>
      <b-col>

        <div class="heading">
          Quorum
        </div>
        <DeckZone name="Quorum Deck" deck-name="decks.quorum" />

      </b-col>
    </b-row>

    <b-row>
      <b-col>
        <div class="heading">
          Crisis
        </div>
      </b-col>
    </b-row>

    <b-row>
      <b-col>
        <DeckZone name="Crisis Deck" deck-name="decks.crisis" />
        <DeckZone name="Super Crisis" deck-name="decks.superCrisis" />
      </b-col>
      <b-col>
        <DeckZone
          name="Crisis Pool"
          deck-name="crisisPool"
          :menu-options="crisisPoolMenuOptions"
        />
        <DeckZone
          name="Destiny"
          deck-name="destiny"
          :menu-options="destinyMenuOptions"
        />
      </b-col>
    </b-row>

    <b-row>
      <b-col>

        <div class="heading">
          Other
        </div>
        <DeckZone name="Destination" deck-name="decks.destination" />
        <DeckZone name="Characters" deck-name="decks.character" />
        <DeckZone name="Titles" deck-name="decks.title" />

      </b-col>
      <b-col>

        <div class="heading">
          Loyalty
        </div>
        <DeckZone name="Loyalty Deck" deck-name="decks.loyalty" />
        <DeckZone name="Human Cards" deck-name="decks.human" />
        <DeckZone name="Cylon Cards" deck-name="decks.cylon" />
        <DeckZone name="Sympathizer" deck-name="decks.sympathizer" />

      </b-col>
    </b-row>

    <b-row>
      <b-col>
        <hr>
        <div class="heading">
          Locations
        </div>
      </b-col>
    </b-row>

    <b-row>
      <b-col>
        <div class="heading">
          Galactica
        </div>
        <DeckZone
          v-for="loc in locationsGalactica"
          :key="loc.name"
          v-bind="locationProps(loc)" />

      </b-col>
      <b-col>
        <div class="heading">
          Colonial One
        </div>
        <DeckZone
          v-for="loc in locationsColonialOne"
          :key="loc.name"
          v-bind="locationProps(loc)" />

        <div class="heading">
          Cylon
        </div>
        <DeckZone
          v-for="loc in locationsCylon"
          :key="loc.name"
          v-bind="locationProps(loc)" />

      </b-col>

      <hr>
    </b-row>

    <b-row>
      <b-col>
        <div class="heading">Centurion Track</div>
        <div class="centurion-steps">
          <DeckZone
            name="C1"
            :hide-menu="true"
            deck-name="centurions.centurions0" />

          <DeckZone
            name="C2"
            :hide-menu="true"
            deck-name="centurions.centurions1" />

          <DeckZone
            name="C3"
            :hide-menu="true"
            deck-name="centurions.centurions2" />

          <DeckZone
            name="C4"
            :hide-menu="true"
            deck-name="centurions.centurions3" />

          <DeckZone
            name="C5"
            :hide-menu="true"
            deck-name="centurions.centurions4" />

        </div>
      </b-col>
    </b-row>

    <div>
      <b-row>
        <b-col>
          <div class="heading">
            Space
          </div>
          <div class="reminder-text">
            <p>Ships can only move clockwise or counter-clockwise around these zones.</p>
            <p>Vipers can launch into the lower zones.</p>
          </div>
        </b-col>
      </b-row>

      <b-row>
        <b-col>
          <DeckZone
            name="Upper Left"
            deck-name="space.space1"
            v-bind="spaceProps()"
          />
        </b-col>
        <b-col>
          <DeckZone
            name="Upper Right"
            deck-name="space.space2"
            v-bind="spaceProps()"
          />
        </b-col>
      </b-row>

      <b-row>
        <b-col>
          <DeckZone
            name="Front"
            deck-name="space.space0"
            v-bind="spaceProps()"
          />
        </b-col>
        <b-col>
          <DeckZone
            name="Back"
            deck-name="space.space3"
            v-bind="spaceProps()"
          />
        </b-col>
      </b-row>

      <b-row>
        <b-col>
          <DeckZone
            name="Lower Left"
            deck-name="space.space5"
            v-bind="spaceProps()"
          />
        </b-col>
        <b-col>
          <DeckZone
            name="Lower Right"
            deck-name="space.space4"
            v-bind="spaceProps()"
          />
        </b-col>
      </b-row>
    </div>

    <b-row>
      <b-col>
        <div class="heading">Ship Tokens</div>
        <DeckZone
          name="Vipers"
          :hide-menu="true"
          deck-name="ships.vipers" />

        <DeckZone
          name="Damaged Vipers"
          :hide-menu="true"
          deck-name="ships.damagedVipers" />

        <DeckZone
          name="Civilians"
          :hide-menu="true"
          deck-name="decks.civilian" />

        <DeckZone
          name="Raiders"
          :hide-menu="true"
          deck-name="ships.raiders" />

        <DeckZone
          name="Heavy Raiders"
          :hide-menu="true"
          deck-name="ships.heavyRaiders" />
      </b-col>
      <b-col>
        <div class="heading">Basestars</div>
        <DeckZone
          name="Basestar A"
          :hide-menu="true"
          deck-name="ships.basestarA" :expanded="true" />

        <DeckZone
          name="Basestar B"
          :hide-menu="true"
          deck-name="ships.basestarB" :expanded="true" />

        <div class="heading">
          Damage Tokens
        </div>
        <DeckZone name="Basestar Damage" deck-name="decks.damageBasestar" />
        <DeckZone name="Galactica Damage" deck-name="decks.damageGalactica" />

      </b-col>
    </b-row>

  </div>
</template>


<script>
import DeckZone from './DeckZone'

import { bsg } from 'battlestar-common'


const activePlayerVariantFunc = function(name) {
  return {
    func() {
      return this.$game.getPlayerCurrentTurn().name === name ? 'activePlayer' : ''
    },
  }
}

const crisisPoolMenuOptions = [
  {
    name: 'shuffle',
    enabled: false,
  },
  {
    name: 'shuffle and reveal',
    func() {
      console.log('shuffle and reveal')
    },
  },
  {
    name: 'discard all',
    func() {
      console.log('discard all')
    },
  },
]

const destinyMenuOptions = [
  {
    name: 'shuffle',
    enabled: false,
  },
  {
    name: 'refill',
    func() {
      console.log('refill destiny')
    },
  },
]

const kindOrder = [
  'player-token',
  'character',
  'title',
  'loyalty',
  'quorum',
  'skill',
  'crisis',
  'superCrisis',
  'destination',
]

const handSort = {
  func(l, r) {
    const lkind = kindOrder.indexOf(l.kind)
    const rkind = kindOrder.indexOf(r.kind)
    if (lkind !== rkind)
      return lkind - rkind

    return l.name.localeCompare(r.name)
  }
}

const locationClickHandler = function(locationName) {
  return {
    func() {
      this.$game.ui.modal.location = locationName
      this.$bvModal.show('locations-modal')
    }
  }
}


export default {
  name: 'Zones',

  components: {
    DeckZone,
  },

  data() {
    return {
      activePlayerVariantFunc,
      crisisPoolMenuOptions,
      destinyMenuOptions,
      handSort,
      skillList: bsg.util.skillList,
    }
  },

  computed: {
    locationsColonialOne() {
      return this.locationFilter('Colonial One')
    },

    locationsCylon() {
      return this.locationFilter('Cylon Locations')
    },

    locationsGalactica() {
      return this.locationFilter('Galactica')
    },

    playerNames() {
      return Object.keys(this.zones.players)
    },
    viewerIsPresident() {
      return false
    },
    zones() {
      return this.$game.getZoneAll()
    },
  },

  methods: {
    locationFilter(area) {
      return Object.values(this.zones.locations).filter(zone => zone.details.area === area)
    },


    locationProps(loc) {
      return {
        count: 'none',
        clickHandlerPost: locationClickHandler(loc.details.name),
        deckName: loc.name,
        expanded: true,
        hideMenu: true,
        name: loc.details.name,
        variant: 'location',
      }
    },

    spaceProps() {
      return {
        count: 'none',
        expanded: true,
        hideMenu: true,
        variant: 'space',
      }
    }
  },
}
</script>


<style scoped>
.centurion-steps {
  display: flex;
  flex-direction: row;
}

.centurion-steps div {
  width: 20%;
}
</style>
