<template>
  <div class="achievement">
    <div>
      <div class="achievement-name">{{ ach.name }}</div>
      <div>{{ ach.unlock }}</div>
      <div class="subtext">created by: {{ username(ach.creatorId) }}</div>
      <div class="subtext">age: {{ ageString(ach) }}</div>
      <div v-if="ach.tags.length > 0">
        <div
          v-for="tag in ach.tags"
          class="achievement-tag badge text-bg-primary"
        >
          {{ tag }}
        </div>
      </div>
    </div>
    <div v-if="!hideMenu">
      <Dropdown :notitle="true">
        <DropdownButton @click="claim(ach)">claim</DropdownButton>
        <DropdownButton @click="edit(ach)">edit</DropdownButton>
        <DropdownButton @click="editTags(ach)">tags</DropdownButton>
        <template v-if="ach.filters">
          <DropdownDivider />
          <DropdownButton @click="showFilters">filters</DropdownButton>
        </template>
        <DropdownDivider />
        <DropdownButton>delete</DropdownButton>
      </Dropdown>
    </div>
  </div>
</template>


<script>
import Dropdown from '@/components/Dropdown'
import DropdownButton from '@/components/DropdownButton'
import DropdownDivider from '@/components/DropdownDivider'


export default {
  name: 'Achievement',

  components: {
    Dropdown,
    DropdownButton,
    DropdownDivider,
  },

  props: {
    ach: Object,

    hideMenu: {
      type: Boolean,
      default: false
    },
  },

  methods: {
    ageString(ach) {
      const millis = Date.now() - ach.createdTimestamp
      const day = 1000 * 60 * 60 * 24
      const days = Math.floor(millis / day)
      return `${days} days`
    },

    claim(ach) {
      this.$store.commit('magic/cube/manageAchievement', {
        achievement: ach,
        showAll: false,
      })
      this.$modal('achievement-viewer-modal').show()
    },

    delete() {
      alert('not implemented; nag Dennis')
    },

    edit(ach) {
      this.$store.commit('magic/cube/manageAchievement', {
        achievement: ach,
        showAll: true,
      })
      this.$modal('achievement-editor').show()
    },

    editTags(ach) {
      this.$store.commit('magic/cube/manageAchievement', {
        achievement: ach,
        showAll: false,
      })
      this.showAll = false
      this.$modal('achievement-editor').show()
    },

    username(id) {
      return id
      /* const user = this.users.find(u => u._id === id)
       * return user ? user.name : id */
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
