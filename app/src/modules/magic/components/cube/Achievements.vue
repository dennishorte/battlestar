<template>
  <div class="achievements">
    <div class="header">
      <button class="btn btn-success" @click="create">create</button>
    </div>

    <div>
      <div v-for="ach in sortedAchievements" class="achievement">
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
        <div>
          <Dropdown :notitle="true">
            <DropdownButton>claim</DropdownButton>
            <DropdownButton @click="edit(ach)">edit</DropdownButton>
            <DropdownButton @click="editTags(ach)">tags</DropdownButton>
            <DropdownDivider />
            <DropdownButton>delete</DropdownButton>
          </Dropdown>
        </div>
      </div>
    </div>

  </div>
</template>


<script>
import Dropdown from '@/components/Dropdown'
import DropdownButton from '@/components/DropdownButton'
import DropdownDivider from '@/components/DropdownDivider'
import Modal from '@/components/Modal'


export default {
  name: 'Achievements',

  components: {
    Dropdown,
    DropdownButton,
    DropdownDivider,
    Modal,
  },

  inject: ['actor', 'cubeId'],

  props: {
    achievements: {
      type: Array,
      default: [],
    },
    users: Array
  },

  data() {
    return {
      showAll: false,
    }
  },

  computed: {
    sortedAchievements() {
      return this
        .achievements
        .sort((l, r) => r.createdTimestamp - l.createdTimestamp)
    },
  },

  methods: {
    ageString(ach) {
      const millis = Date.now() - ach.createdTimestamp
      const day = 1000 * 60 * 60 * 24
      const days = Math.floor(millis / day)
      return `${days} days`
    },

    blank() {
      return {
        name: '',
        unlock: '',
        hidden: [],
        tags: [],
        starred: [],

        creatorId: this.actor._id,
        cubeId: this.cubeId,
      }
    },

    create() {
      this.$store.commit('magic/cube/manageAchievement', {
        achievement: this.blank(),
        showAll: true,
      })
      this.$modal('achievement-editor').show()
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
      const user = this.users.find(u => u._id === id)
      return user ? user.name : id
    },
  },
}
</script>


<style scoped>
.header {
  margin: .5em 0;
}

.hidden-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

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
