<template>
    <v-row>
      <v-col cols="12">
        <v-row align="center" justify="center">
          <div class="ct-chart">
            <canvas id="yearSalesChart"></canvas>
          </div>
        </v-row>
      </v-col>
    </v-row>
</template>

<script>
import axios from 'axios';
import Chart from 'chart.js';
  export default {
    data: () => ({
      values : [],
      months: [],
      totals: []
    }),
    computed: {
        configHeader() {
          let token = this.$store.state.token;
          let header = { "token": this.$store.state.token };
          return { headers: header };
        },
        currentCustomerId(){
            return this.$store.state.user.customerId;
        }
    },
    methods: {
      getYearGraph() {
        let self = this;
        axios
            .post("sale/yearGraph", {customer: this.currentCustomerId}, this.configHeader)
            .then(res => {
                self.values = res.data;
                self.graph();
            })
            .catch(err => {
                console.log(err);
            });
      },
      graph(){
        let self = this;
        self.values.map(value => {
          let monthName = "";
          switch(parseInt(value._id.month)){
            case 1:
              monthName="Enero"
              break;
            case 2:
              monthName="Febrero"
              break;
            case 3:
              monthName="Marzo"
              break;
            case 4:
              monthName="Abril"
              break;
            case 5:
              monthName="Mayo"
              break;
            case 6:
              monthName="Junio"
              break;
            case 7:
              monthName="Julio"
              break;
            case 8:
              monthName="Agosto"
              break;
            case 9:
              monthName="Septiembre"
              break;
            case 10:
              monthName="Octubre"
              break;
            case 11:
              monthName="Noviembre"
              break;
            case 12:
              monthName="Diciembre"
              break;
            default:
              monthName="Error"
              break;
          }
          self.months.push(monthName + ' (' + value._id.year + ')');
          self.totals.push(value.total);
        })

        var ctx = document.getElementById('yearSalesChart');
        var myChart = new Chart(ctx, {
            type: 'horizontalBar',
            data: {
                labels: self.months,
                datasets: [{
                    label: 'venta',
                    data: self.totals,
                    backgroundColor: [
                        '#E57373',
                        '#BCAAA4',
                        '#BA68C8',
                        '#64B5F6',
                        '#FFF176',
                        '#9575CD',
                        '#4FC3F7',
                        '#FFD54F',
                        '#4DB6AC',
                        '#DCE775',
                        '#FFB74D',
                        '#81C784',
                    ],
                    borderColor: [
                        '#E57373',
                        '#BCAAA4',
                        '#BA68C8',
                        '#64B5F6',
                        '#FFF176',
                        '#9575CD',
                        '#4FC3F7',
                        '#FFD54F',
                        '#4DB6AC',
                        '#DCE775',
                        '#FFB74D',
                        '#81C784',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                legend: {
                    display: false
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }],
                    xAxes: [{
                        gridLines: {
                            offsetGridLines: true
                        }
                    }]
                }
            }
        });


      },
    },
    mounted(){
      this.getYearGraph();
    }
  }
</script>

<style scooped>
.ct-chart{
    height: 70vh;
    width: 70vw;
}
</style>