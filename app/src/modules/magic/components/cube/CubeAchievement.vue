<template>
  <div class="achievement">
    <div>
      <div class="achievement-name">{{ ach.name }}</div>
      <div>{{ ach.unlock }}</div>
      <div class="subtext" v-if="claimed">claimed by: {{ username(ach.claimed.userId) }}</div>
      <div class="subtext">created by: {{ username(ach.creatorId) }}</div>
      <div class="subtext">age: {{ ageString(ach) }}</div>
      <div v-if="ach.tags.length > 0">
        <div
          v-for="tag in ach.tags"
          :key="tag"
          class="achievement-tag badge text-bg-primary"
        >
          {{ tag }}
        </div>
      </div>
    </div>

    <div v-if="!hideMenu">
      <DropdownMenu :notitle="true">

        <template v-if="claimed">
          <DropdownButton @click="view">view</DropdownButton>
          <DropdownButton @click="clone">clone</DropdownButton>
        </template>

        <template v-else>
          <DropdownButton @click="claim">claim</DropdownButton>
          <DropdownButton @click="edit">edit</DropdownButton>
          <DropdownButton @click="clone">clone</DropdownButton>
          <DropdownButton @click="editTags">tags</DropdownButton>
          <template v-if="ach.filters">
            <DropdownDivider />
            <DropdownButton @click="showFilters">targets</DropdownButton>
          </template>
          <DropdownDivider />
          <DropdownButton @click="del">delete</DropdownButton>
        </template>
      </DropdownMenu>
    </div>
  </div>
</template>


<script>
import { mapState } from 'vuex'
import { util } from 'battlestar-common'

import DropdownMenu from '@/components/DropdownMenu'
import DropdownButton from '@/components/DropdownButton'
import DropdownDivider from '@/components/DropdownDivider'


export default {
  name: 'CubeAchievement',

  components: {
    DropdownMenu,
    DropdownButton,
    DropdownDivider,
  },

  inject: ['bus'],

  props: {
    ach: {
      type: Object,
      required: true
    },

    hideMenu: {
      type: Boolean,
      default: false
    },
  },

  computed: {
    ...mapState('magic', {
      users: 'users',
    }),

    claimed() {
      return Boolean(this.ach.claimed)
    },
  },

  methods: {
    ageString(ach) {
      const millis = Date.now() - ach.createdTimestamp
      const day = 1000 * 60 * 60 * 24
      const days = Math.floor(millis / day)
      return `${days} days`
    },

    claim() {
      this.$store.commit('magic/cube/manageAchievement', {
        achievement: this.ach,
        showAll: false,
      })
      this.$modal('achievement-viewer-modal').show()
    },

    clone() {
      const dup = util.deepcopy(this.ach)
      dup.name = dup.name + ' clone'
      delete dup._id
      this.$store.commit('magic/cube/manageAchievement', {
        achievement: dup,
        showAll: true,
      })
      this.$modal('achievement-editor').show()
    },

    del() {
      this.$store.dispatch('magic/cube/deleteAchievement', this.ach)
    },

    edit() {
      this.$store.commit('magic/cube/manageAchievement', {
        achievement: this.ach,
        showAll: true,
      })
      this.$modal('achievement-editor').show()
    },

    editTags() {
      this.$store.commit('magic/cube/manageAchievement', {
        achievement: this.ach,
        showAll: false,
      })
      this.showAll = false
      this.$modal('achievement-editor').show()
    },

    showFilters() {
      this.$store.dispatch('magic/cube/setFilters', this.ach.filters)
      this.bus.emit('achievement-show-filters', this.ach.filters)
    },

    username(id) {
      const user = this.users.find(u => u._id === id)
      return user ? user.name : id
    },

    view() {
      this.$store.commit('magic/cube/manageAchievement', {
        achievement: this.ach,
        showAll: false,
      })
      this.$modal('achievement-viewer-modal').show()
    },
  },
}
</script>


<style scoped>
.achievement {
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  border: 1px solid #999;
  border-radius: .5em;
  padding: .25em .5em;
}

.achievement:not(:first-of-type) {
  margin-top: .5em;
}

.achievement-name {
  font-weight: bold;
}

.subtext {
  font-size: .8em;
  font-color: #333;
  margin-left: .5em;
}

.achievement-tag {
  margin-left: .5em;
}
</style>
