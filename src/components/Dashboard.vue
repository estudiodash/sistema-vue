<template>
  <v-container id="dashboard" fluid tag="section">
    <v-row>
      <v-col cols="12" lg="4" v-if="false">
        <base-material-chart-card
          :data="emailsSubscriptionChart.data"
          :options="emailsSubscriptionChart.options"
          :responsive-options="emailsSubscriptionChart.responsiveOptions"
          color="#E91E63"
          hover-reveal
          type="Bar"
        >

          <h4 class="card-title font-weight-light mt-2 ml-2">
            Estadística anual
          </h4>

          <p class="d-inline-flex font-weight-light ml-2 mt-1">
            Ventas de los ultimos 12 meses
          </p>

          <template v-slot:actions>
            <v-icon
              class="mr-1"
              small
            >
              mdi-clock-outline
            </v-icon>
            <span class="caption grey--text font-weight-light">Actualizado hace 10 minutes</span>
          </template>
        </base-material-chart-card>
      </v-col>

      <v-col cols="12" lg="4" v-if="false">
        <base-material-chart-card
          :data="dailySalesChart.data"
          :options="dailySalesChart.options"
          color="success"
          hover-reveal
          type="Line"
        >

          <h4 class="card-title font-weight-light mt-2 ml-2">
            Estadística semanal
          </h4>

          <p class="d-inline-flex font-weight-light ml-2 mt-1">
            Ventas de los ultimos 7 días
          </p>

          <template v-slot:actions>
            <v-icon
              class="mr-1"
              small
            >
              mdi-clock-outline
            </v-icon>
            <span class="caption grey--text font-weight-light">Actualizado hace 1 minuto</span>
          </template>
        </base-material-chart-card>
      </v-col>

      <v-col cols="12" lg="4" v-if="false">
        <base-material-chart-card
          :data="dataCompletedTasksChart.data"
          :options="dataCompletedTasksChart.options"
          hover-reveal
          color="info"
          type="Line"
        >

          <h3 class="card-title font-weight-light mt-2 ml-2">
            Estadística de stock
          </h3>

          <p class="d-inline-flex font-weight-light ml-2 mt-1">
            Últimos ingresos al inventario
          </p>

          <template v-slot:actions>
            <v-icon
              class="mr-1"
              small
            >
              mdi-clock-outline
            </v-icon>
            <span class="caption grey--text font-weight-light">Actualizado hace 3 minutos</span>
          </template>
        </base-material-chart-card>
      </v-col>

      <v-col
        cols="12"
        sm="6"
        lg="3"
      >
        <base-material-stats-card
          color="info"
          icon="mdi-store"
          title="Productos"
          :value="totalProducts"
          sub-icon="mdi-clock"
          sub-text="Basado en el total del inventario"
        />
      </v-col>

      <v-col
        cols="12"
        sm="6"
        lg="3"
      >
        <base-material-stats-card
          color="orange"
          icon="mdi-account-group"
          title="Clientes"
          :value="totalClients"
          sub-icon="mdi-tag"
          sub-text="Todos los clientes registrados"
        />
      </v-col>

      <v-col
        cols="12"
        sm="6"
        lg="3"
      >
        <base-material-stats-card
          color="primary"
          icon="mdi-cash-usd-outline"
          title="Total Mensual"
          :value="totalSalesMonth"
          sub-icon="mdi-calendar"
          sub-text="Se calculan los últimos 30 días"
        />
      </v-col>

      <v-col
        cols="12"
        sm="6"
        lg="3"
      >
        <base-material-stats-card
          color="success"
          icon="mdi-cash-multiple"
          title="Total histórico"
          :value="totalSales"
          sub-icon="mdi-tag"
          sub-text="Solo ventas procesadas"
        />
      </v-col>

      <v-col
        cols="12"
        md="6"
      >
        <base-material-card color="warning" class="px-5 py-3">
          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              Últimas ventas
            </div>

            <div class="subtitle-1 font-weight-light">
              Nuevas ventas registradas hast el día de la fecha
            </div>
          </template>
          <v-card-text>
            <v-data-table :headers="headersSales" :items="sales" hide-default-footer>

              <template v-slot:item.createdAt="{ item }">
                {{ item.createdAt | formatDate}}
              </template>

              <template v-slot:item.total="{ item }">
                ${{ item.total}}
              </template>

            </v-data-table>
          </v-card-text>
        </base-material-card>
      </v-col>

      <v-col cols="12" md="6">
        <base-material-card class="px-5 py-3">
          <template v-slot:heading>
            <v-tabs v-model="tabs" background-color="transparent" slider-color="white">
              <v-tab class="mr-3">
                <v-icon class="mr-2">
                  mdi-account-switch
                </v-icon>
                Clientes
              </v-tab>
              <v-tab class="mr-3">
                <v-icon class="mr-2">
                  mdi-cart
                </v-icon>
                Productos
              </v-tab>
              <v-tab>
                <v-icon class="mr-2">
                  mdi-account-multiple-outline
                </v-icon>
                Usuarios recientes
              </v-tab>
            </v-tabs>
          </template>

          <v-tabs-items v-model="tabs" class="transparent">
            <v-tab-item>
              <v-card-text>
                <template>
                  <v-data-table :headers="headersCustomers" :items="customers" hide-default-footer/>
                </template>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions>
                <v-icon color="grey" size="16" class="ml-2 mr-1">
                  mdi-page-next
                </v-icon>
                <span class="caption caption grey--text font-weight-light" v-text="'Basado en los últimos registros'"/>

                <v-spacer></v-spacer>

                <v-btn class="ma-2" tile outlined color="success" :to="{name:'customers'}">
                  <v-icon left>mdi-page-next</v-icon> Ver todos los clientes
                </v-btn>
              </v-card-actions>

            </v-tab-item>

            <v-tab-item>
              <v-card-text>
                <template>
                  <v-data-table :headers="headersProducts" :items="products" hide-default-footer/>
                </template>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions>
                <v-icon color="grey" size="16" class="ml-2 mr-1">
                  mdi-page-next
                </v-icon>
                <span class="caption caption grey--text font-weight-light" v-text="'Basado en los últimos ingresoss'"/>

                <v-spacer></v-spacer>

                <v-btn class="ma-2" tile outlined color="success" :to="{name:'products'}">
                  <v-icon left>mdi-page-next</v-icon> Ver todos los Productos
                </v-btn>
              </v-card-actions>

            </v-tab-item>

            <v-tab-item>
              <v-card-text>
                <template>
                  <v-data-table :headers="headersUsers" :items="users" hide-default-footer/>
                </template>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions>
                <v-icon color="grey" size="16" class="ml-2 mr-1">
                  mdi-page-next
                </v-icon>
                <span class="caption caption grey--text font-weight-light" v-text="'Basado en los últimos registros'"/>

                <v-spacer></v-spacer>

                <v-btn class="ma-2" tile outlined color="success" :to="{name:'user'}">
                  <v-icon left>mdi-page-next</v-icon> Ver todos los Usuarios
                </v-btn>
              </v-card-actions>

            </v-tab-item>

          </v-tabs-items>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import axios from "axios";
  export default {
    name: 'DashboardDashboard',

    data () {
      return {
        products: [],
        totalProducts: '',
        totalClients: '',
        totalSalesMonth: '',
        totalSales: '',
        sales: [],
        customers: [],
        users: [],
        dailySalesChart: {
          data: {
            labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
            series: [
              [12, 17, 7, 17, 23, 18, 38],
            ],
          },
          options: {
            lineSmooth: this.$chartist.Interpolation.cardinal({
              tension: 0,
            }),
            low: 0,
            high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
            chartPadding: {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            },
          },
        },
        dataCompletedTasksChart: {
          data: {
            labels: ['12am', '3pm', '6pm', '9pm', '12pm', '3am', '6am', '9am'],
            series: [
              [230, 750, 450, 300, 280, 240, 200, 190],
            ],
          },
          options: {
            lineSmooth: this.$chartist.Interpolation.cardinal({
              tension: 0,
            }),
            low: 0,
            high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
            chartPadding: {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            },
          },
        },
        emailsSubscriptionChart: {
          data: {
            labels: ['En', 'Fe', 'Mar', 'Ab', 'May', 'Ju', 'Jul', 'Ag', 'Se', 'Oc', 'No', 'Di'],
            series: [
              [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 600],
            ],
          },
          options: {
            axisX: {
              showGrid: false,
            },
            low: 0,
            chartPadding: {
              top: 0,
              right: 5,
              bottom: 0,
              left: 0,
            },
          },
          responsiveOptions: [
            ['screen and (max-width: 640px)', {
              seriesBarDistance: 5,
              axisX: {
                labelInterpolationFnc: function (value) {
                  return value[0]
                },
              },
            }],
          ],
        },
        headersSales: [
          {
            sortable: false,
            text: 'Cliente',
            value: 'person.name',
          },
          {
            sortable: false,
            text: 'Usuario',
            value: 'user.name',
          },
          {
            sortable: false,
            text: 'Fecha',
            value: 'createdAt'
          },
          {
            sortable: false,
            text: 'Total',
            value: 'total',
            align: 'left',
          }
        ],
        headersCustomers: [
          {
            sortable: false,
            text: 'Nombre',
            value: 'name',
          },
          {
            sortable: false,
            text: 'Direccion',
            value: 'address',
          },
          {
            sortable: false,
            text: 'Email',
            value: 'email',
            align: 'left',
          },
          {
            sortable: false,
            text: 'Telefono',
            value: 'tel'
          }
        ],
        headersUsers: [
          {
            sortable: false,
            text: 'Nombre',
            value: 'name',
          },
          {
            sortable: false,
            text: 'Rol',
            value: 'rol',
          },
          {
            sortable: false,
            text: 'Email',
            value: 'email',
            align: 'left',
          },
          {
            sortable: false,
            text: 'Telefono',
            value: 'tel'
          }
        ],
        headersProducts: [
          {
            sortable: false,
            text: 'Codigo',
            value: 'code',
          },
          {
            sortable: false,
            text: 'Categoria',
            value: 'category.name',
          },
          {
            sortable: false,
            text: 'Nombre',
            value: 'name',
            align: 'left',
          },
          {
            sortable: false,
            text: 'Precio',
            value: 'price'
          },
          {
            sortable: false,
            text: 'Stock',
            value: 'stock'
          }
        ],
        tabs: 0
      }
    },
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
    created() {
        this.getProducts();
        this.getTotalClients();
        this.getTotalProducts();
        this.getTotalSalesMonth();
        this.getTotalSales();
        this.getListOfSales();
        this.getListOfCustomers();
        this.getlistOfUsers();
    },
    methods: {
      complete (index) {
        this.list[index] = !this.list[index]
      },
      getProducts() {
        let self = this;
        axios
          .post("/product/list", {customer: this.currentCustomerId}, this.configHeader)
          .then(res => {
              self.products = res.data.slice(0,5);
          })
          .catch(err => {
              console.log(err);
          });
      },
      getTotalProducts() {
        let self = this;
        axios
          .post("/product/totalProducts", {customer: this.currentCustomerId}, this.configHeader)
          .then(res => {
              self.totalProducts = res.data.total.toString();
          })
          .catch(err => {
              console.log(err);
          });
      },
      getTotalClients() {
        let self = this;
        axios
          .post("/person/totalClients", {customer: this.currentCustomerId}, this.configHeader)
          .then(res => {
              self.totalClients = res.data.total.toString();
          })
          .catch(err => {
              console.log(err);
          });
      },
      getTotalSalesMonth() {
        let self = this;
        axios
          .post("/sale/totalSalesMonth", {customer: this.currentCustomerId}, this.configHeader)
          .then(res => {
            let total = res.data[0].total.toString();
            self.totalSalesMonth = '$' + total;
          })
          .catch(err => {
              console.log(err);
          });
      },
      getTotalSales() {
        let self = this;
        axios
          .post("/sale/totalSales", {customer: this.currentCustomerId}, this.configHeader)
          .then(res => {
            let total = res.data[0].total.toString();
            self.totalSales = '$' + total;
          })
          .catch(err => {
              console.log(err);
          });
      },
      getListOfSales() { // get all sales list
        let self = this;
        axios
          .post("/sale/list", {customer: this.currentCustomerId}, this.configHeader)
          .then(res => {
            let sales = res.data.slice(0, 5);
            self.sales = sales;
          })
          .catch(err => {
              console.log(err);
          });
      },
      getListOfCustomers() {
        let self = this;
        axios
          .post("/person/listClients", {customer : this.currentCustomerId}, this.configHeader)
          .then(res => {
              self.customers = res.data.slice(0, 5);
          })
          .catch(err => {
              console.log(err);
          });
      },
      getlistOfUsers() {
        let self = this;
        axios
          .post("/user/list", {customerId: this.currentCustomerId}, this.configHeader)
          .then(res => {
              self.users = res.data.slice(0,5);
          })
          .catch(err => {
              console.log(err);
          });
      },
    },
  }
</script>

<style>
  .v-sheet.v-card {
    margin: 20px 0;
  }

  .theme--light.v-application .text--primary {
    font-size: 2rem !important;
  }
</style>