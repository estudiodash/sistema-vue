<template>
  <v-app id="app" class="app" :class="{isLoading : isLoading}">
    <div :class="{showLoading : isLoading}" class="loading-wrapper"><div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div></div>
    <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app color="primary" dark v-if="loggedIn">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
        <span class="hidden-sm-and-down">{{currentCustomerName}}</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn class="ml-2" min-width="0" text to="/">
        <v-icon>mdi-view-dashboard</v-icon>
      </v-btn>

      <v-btn class="ml-2" min-width="0" text to="/my-profile">
        <v-icon>mdi-account</v-icon>
      </v-btn>

      <v-btn class="ml-2" min-width="0" text @click="logout()">
        <v-icon>logout</v-icon>
      </v-btn>      
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" app v-if="loggedIn">
      <v-list dense>

        <template v-if="isAdmin || isControl || isSeller">
          <v-list-item :to="{name:'home'}">
            <v-list-item-action>
              <v-icon>home</v-icon>
            </v-list-item-action>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item>
        </template>

        <template v-if="isAdmin || isControl ">
          <v-list>
            <v-list-group prepend-icon="all_inbox">
              <template v-slot:activator>
                <v-list-item-title>Inventario</v-list-item-title>
              </template>

              <v-list-item :to="{name: 'categories'}">
                <v-list-item-action>
                  <v-icon>table_chart</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Categorias</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item :to="{name: 'products'}">
                <v-list-item-action>
                  <v-icon>table_chart</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Productos</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-group>
          </v-list>
        </template>

        <template v-if="isAdmin || isControl ">
          <v-list>
            <v-list-group prepend-icon="addchart">
              <template v-slot:activator>
                <v-list-item-title>Compras</v-list-item-title>
              </template>

              <v-list-item :to="{name: 'entries'}">
                <v-list-item-action>
                  <v-icon>table_chart</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Ingresos</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item :to="{name: 'providers'}">
                <v-list-item-action>
                  <v-icon>table_chart</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Proveedores</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-group>
          </v-list>
        </template>

        <template v-if="isAdmin || isSeller">
          <v-list>
            <v-list-group prepend-icon="assignment">
              <template v-slot:activator>
                <v-list-item-title>Despacho</v-list-item-title>
              </template>

              <v-list-item :to="{name: 'sales'}">
                <v-list-item-action>
                  <v-icon>table_chart</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Ventas</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item :to="{name: 'customers'}">
                <v-list-item-action>
                  <v-icon>table_chart</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Clientes</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-group>
          </v-list>
        </template>

        <template v-if="false">
          <v-list>
            <v-list-group prepend-icon="bar_chart">
              <template v-slot:activator>
                <v-list-item-title>Estadísticas</v-list-item-title>
              </template>

              <v-list-item :to="{name: 'statics-entries'}">
                <v-list-item-action>
                  <v-icon>timeline</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Compras</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item :to="{name: 'statics-sales'}">
                <v-list-item-action>
                  <v-icon>timeline</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Ventas</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-group>
          </v-list>
        </template>

        <template v-if="isAdmin">
          <v-list>
              <v-list-item :to="{name: 'user'}">
                <v-list-item-action>
                  <v-icon>supervised_user_circle</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Acceso de Usuarios</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-group>
          </v-list>
        </template>

      </v-list>
    </v-navigation-drawer>

    <v-main class="grey lighten-4" :class="{login : !loggedIn}">
      <v-container class="fill-height" fluid>
        <v-slide-y-transition>
          <router-view />
        </v-slide-y-transition>
      </v-container>

      <v-footer
        id="dashboard-core-footer"
      >
        <v-container>
          <v-row
            align="center"
            no-gutters
          >
            <v-col
              v-for="(link, i) in links"
              :key="i"
              class="text-center mb-sm-0 mb-5"
              cols="auto"
              v-show="loggedIn"
            >
              <a
                :href="link.href"
                class="mr-10 grey--text text--darken-3"
                rel="noopener"
                target="_blank"
                v-text="link.text"
              />
            </v-col>

            <v-spacer class="hidden-sm-and-down" />

            <v-col cols="12" md="auto">
              <div class="body-1 font-weight-light pt-6 pt-md-0 text-center">
                &copy; {{ new Date().getFullYear() }} - 
                Made it by <a href="https://www.vaidonna.com">Vaidonna</a>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-footer>
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios";
export default {
  name: "App",
  data: () => ({
    drawer: null,
      links: [
        {
          href: '#',
          text: 'Nuestras ideas',
        },
        {
          href: '#',
          text: 'Nosotros',
        },
        {
          href: '#',
          text: 'Blog',
        },
        {
          href: '#',
          text: 'Soporte',
        },
      ],
  }),
  computed: {
    loggedIn(){
      return this.$store.state.user;
    },
    isAdmin(){
      return this.$store.state.user && this.$store.state.user.rol == 'admin';  // Verifico si el usuario es administrador desde el store de vuex 
    },
    isControl(){
      return this.$store.state.user && this.$store.state.user.rol == 'control'; // Verifico si el usuario es control desde el store de vuex
    },
    isSeller(){
      return this.$store.state.user && this.$store.state.user.rol == 'seller'; // Verifico si el usuario es vendedor desde el store de vuex
    },
    isLoading(){
      return this.$store.state.isLoading;
    },
    currentCustomerName(){
        return this.$store.state.user.customerName;
    }
  },
  created() {
    this.$store.dispatch('AUTOLOGIN');

  axios.interceptors.request.use((config) => {
    // trigger 'loading=true' event here
    this.$store.dispatch('LOADING', true);
    return config;
  }, (error) => {
    // trigger 'loading=false' event here
    this.$store.dispatch('LOADING', false);
    return Promise.reject(error);
  });

  axios.interceptors.response.use((response) => {
    // trigger 'loading=false' event here
    this.$store.dispatch('LOADING', false);
    return response;
  }, (error) => {
    // trigger 'loading=false' event here
    this.$store.dispatch('LOADING', false);
    return Promise.reject(error);
  });

  },
  methods: {
    logout(){
      this.$store.dispatch('LOGOUT');
    }
  },
};
</script>


<style scooped>
    .login {
        background-image: url('https://www.ariba.com/es/-/media/aribacom/page-images/02-solutions/022000_solutions-overview/0224000_procurement/hero_procurement.jpg?');
        background-size: cover;
        background-position: center;
    }

    .loading-wrapper.showLoading {
      opacity: 1;
      visibility: visible;
      position: relative;
    }

    .loading-wrapper {
      position: absolute;
      width: 100%;
      height: 100vh;
      background: rgba(255, 255, 255, 0.8);
      z-index: 10;
      opacity: 0;
      visibility: hidden;
      transition: all .5s;
    }

    .lds-ellipsis {
      display: inline-block;
      position: absolute;
      width: 80px;
      height: 80px;
      z-index: 9999;
      transform: translate(-40px, -40px);
      left: 50%;
      top: 50%;
    }
    .lds-ellipsis div {
      position: absolute;
      top: 33px;
      width: 13px;
      height: 13px;
      border-radius: 50%;
      background: #CD1B27;
      animation-timing-function: cubic-bezier(0, 1, 1, 0);
    }
    .lds-ellipsis div:nth-child(1) {
      left: 8px;
      animation: lds-ellipsis1 0.6s infinite;
    }
    .lds-ellipsis div:nth-child(2) {
      left: 8px;
      animation: lds-ellipsis2 0.6s infinite;
    }
    .lds-ellipsis div:nth-child(3) {
      left: 32px;
      animation: lds-ellipsis2 0.6s infinite;
    }
    .lds-ellipsis div:nth-child(4) {
      left: 56px;
      animation: lds-ellipsis3 0.6s infinite;
    }
    @keyframes lds-ellipsis1 {
      0% {
        transform: scale(0);
      }
      100% {
        transform: scale(1);
      }
    }
    @keyframes lds-ellipsis3 {
      0% {
        transform: scale(1);
      }
      100% {
        transform: scale(0);
      }
    }
    @keyframes lds-ellipsis2 {
      0% {
        transform: translate(0, 0);
      }
      100% {
        transform: translate(24px, 0);
      }
    }

</style>