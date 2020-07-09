<template>
  <v-container fluid>
    <SalesChart/>
  </v-container>
</template>

<script>
// @ is an alias to /src
import SalesChart from '@/components/SalesChart.vue'

export default {
  name: 'Home',
  components: {
    SalesChart
  }
}
</script>
