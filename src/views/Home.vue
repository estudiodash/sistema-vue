<template>
  <v-container fluid>
    <Dashboard/>
  </v-container>
</template>

<script>
// @ is an alias to /src
import Dashboard from '@/components/Dashboard.vue'

export default {
  name: 'Home',
  components: {
    Dashboard
  }
}
</script>
