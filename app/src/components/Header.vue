<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <div class="header text-left">

          <Dropdown>
            <DropdownItem><router-link to="/">home</router-link></DropdownItem>
            <DropdownItem><router-link to="/lobby/create">new lobby</router-link></DropdownItem>
            <DropdownItem><router-link to="/data">data</router-link></DropdownItem>
            <DropdownDivider></DropdownDivider>
            <DropdownItem><router-link to="/admin">admin</router-link></DropdownItem>
            <DropdownItem><router-link to="/logout">logout</router-link></DropdownItem>
          </Dropdown>

          <a href="/" class="link-unstyled">
            <h1>Game Center</h1>
          </a>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Dropdown from '@/components/Dropdown'
import DropdownDivider from '@/components/DropdownDivider'
import DropdownItem from '@/components/DropdownItem'

export default {
  name: 'Header',

  components: {
    Dropdown,
    DropdownDivider,
    DropdownItem,
  },
}
</script>

<style scoped>
.header {
  text-align: center;
}

#header-dropdown {
  float: right;
  margin: .5em;
}
</style>
