<template>
<div class="header">
  <b-dropdown id="header-dropdown" text="menu" right>
    <b-dropdown-item>
      <router-link to="/">home</router-link>
    </b-dropdown-item>

    <b-dropdown-item>
      <router-link to="/admin">admin</router-link>
    </b-dropdown-item>

    <b-dropdown-item>
      <router-link to="/logout">logout</router-link>
    </b-dropdown-item>
  </b-dropdown>

  <h1>Game Center</h1>

</div>
</template>

<script>
export default {
  name: 'Header',
}
</script>

<style>
.header {
    text-align: center;
}

#header-dropdown {
    float: right;
    margin: .5em;
}
</style>
