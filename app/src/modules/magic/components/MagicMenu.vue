<template>
  <Dropdown text="Menu" class="game-menu">
    <DropdownItem><button @click="home">home</button></DropdownItem>
    <DropdownDivider />
    <DropdownItem><button @click="decks">decks</button></DropdownItem>
  </Dropdown>

</template>


<script>
import Dropdown from '@/components/Dropdown'
import DropdownDivider from '@/components/DropdownDivider'
import DropdownItem from '@/components/DropdownItem'

export default {
  name: 'MagicMenu',

  components: {
    Dropdown,
    DropdownDivider,
    DropdownItem,
  },

  methods: {
    collections() {
      this.$router.push('/magic/collections')
    },
    decks() {
      this.$router.push('/magic/decks')
    },
    home() {
      this.$router.push('/')
    },
  },
}
</script>


<style scoped>
.game-menu {
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;

  height: 3em;
  padding: 0 .25em;
  text-align: center;
}
</style>
