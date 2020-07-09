<template>
  <v-container
    id="user-profile"
    fluid
    tag="section"
  >
    <v-row justify="center">
      <v-col
        cols="12"
        md="8"
      >
        <base-material-card color="warning">
          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              Edite su Perfil
            </div>

            <div class="subtitle-1 font-weight-light">
              Complete todos sus datos
            </div>
          </template>

          <v-form>
            <v-container class="py-0">
              <v-row>

                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    label="Nombre Completo"
                    class="purple-input"
                    v-model="name"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    label="Email"
                    class="purple-input"
                    v-model="email"
                  />
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    label="Direccion"
                    class="purple-input"
                    v-model="address"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    label="Teléfono"
                    class="purple-input"
                    type="number"
                    v-model="tel"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                >
                    <v-select :items="listDoc" v-model="typeDni" label="Tipo Documento"></v-select>
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    label="Número de Documento"
                    class="purple-input"
                    type="number"
                    v-model="numDni"
                  />
                </v-col>

                <v-col cols="12" class="red--text" v-show="validate" v-for="errorMessage in validateMessage">
                    {{errorMessage}}
                </v-col>

                <v-col
                  cols="12"
                  class="text-center"
                >
                
                  <v-btn
                    color="success"
                    class="mr-0"
                    @click="save()"
                  >
                    Guardar Perfil
                  </v-btn>
                </v-col>

              </v-row>
            </v-container>
          </v-form>
        </base-material-card>
      </v-col>

      <v-col
        cols="12"
        md="4"
      >
        <base-material-card
          class="v-card-profile"
          :avatar="nameIcon"
        >
          <v-card-text class="text-center">
            <h6 class="display-1 mb-1 grey--text">
              {{currentCustomer}}
            </h6>

            <h4 class="display-2 font-weight-light mb-3 black--text">
              {{name}}
            </h4>

            <p class="font-weight-light grey--text mt-10">
                <v-icon
                color="grey"
                size="16"
                class="ml-2 mr-1">
                    mdi-calendar
                </v-icon>
              Fecha de alta: <strong>{{createdAt | formatDate}}</strong>
            </p>

            <v-chip :color="getColor(status)" dark>
                <span v-if="status">Activo</span>
                <span v-else>Inactivo</span>
            </v-chip>

                <v-col
                  cols="12"
                  class="text-center"
                >
                  <v-btn
                    color="info"
                    @click="updatePassword = true"
                    class="mt-10"
                  >
                    Cambiar Contraseña
                  </v-btn>

                </v-col>


          </v-card-text>
        </base-material-card>
      </v-col>
    </v-row>

    <v-dialog v-model="updatePassword" max-width="300" persistent>
        <v-card>
            <v-card-text class="text-center pt-5 body-1" v-if="!showLogin">
                <v-col cols="12" >
                  <v-text-field
                    label="Nueva contraseña"
                    class="purple-input"
                    type="password"
                    v-model="newPassword"
                  />
                </v-col>

                <v-col cols="12" >
                  <v-text-field
                    label="Repita contraseña"
                    class="purple-input"
                    type="password"
                    v-model="verifyPassword"
                  />
                </v-col>

                <v-col cols="12" class="red--text" v-if="isPasswordError">
                    {{passwordError}}
                </v-col>

            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn v-if="!showLogin" color="red" dark fab @click="updatePassword = false">
                    <v-icon color="white">clear</v-icon>
                </v-btn>
                <v-btn v-if="!showLogin" color="green" dark fab @click="processUpdatePassword()">
                    <v-icon color="white">check</v-icon>
                </v-btn>
                <v-spacer v-if="!showLogin"></v-spacer>
                <v-btn v-if="showLogin" color="red" @click="loginAgain()" class="white--text text-center">Iniciar sesión nuevamente</v-btn>
                <v-spacer v-if="showLogin"></v-spacer>
            </v-card-actions>
        </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
  import axios from "axios";
  export default {
    data: () => ({
        name: '',
        listDoc: ['DNI', 'Pasaporte', 'Cedula'],
        typeDni: '',
        numDni: '',
        address: '',
        rol: '',
        tel: '',
        email: '',
        status: '',
        password: '',
        newPassword: '',
        verifyPassword: '',
        createdAt: '',
        updatePassword: false,
        validate: false,
        validateMessage: [],
        showLogin: false,
        isPasswordError: false,
        passwordError: ''
    }),
    created() {
        this.getData();
    },
    computed: {
        configHeader() {
            let token = this.$store.state.token;
            let header = { "token": this.$store.state.token };
            return { headers: header };
        },
        currentUserId(){
            return this.$store.state.user._id;
        },
        currentCustomer(){
            return this.$store.state.user.customerName;
        },
        currentCustomerId(){
            return this.$store.state.user.customerId;
        },
        nameIcon(){
            let arrayName = this.$store.state.user.name.split(" "); // stefania nicola
            return arrayName[0].charAt(0) + arrayName[arrayName.length - 1].charAt(0);
        },
    },
    methods: {
        getData() {
            let self = this;
            axios
                .get("/user/query?_id=" + this.currentUserId, this.configHeader)
                .then(res => {
                    this._id = res.data._id,
                    this.name = res.data.name,
                    this.typeDni = res.data.typeDni,
                    this.numDni = res.data.numDni,
                    this.address = res.data.address,
                    this.tel = res.data.tel,
                    this.rol = res.data.rol,
                    this.email = res.data.email,
                    this.status = res.data.status,
                    this.password = res.data.password,
                    this.createdAt = res.data.createdAt
                })
                .catch(err => {
                    console.log(err);
                });
        },
        validateSubmit() {
            this.validate = false;
            this.validateMessage = [];
            if (!this.rol) {
                this.validateMessage.push(
                    "Seleccione un rol."
                );
            }
            if (this.typeDni.length > 20) {
                this.validateMessage.push(
                    "El documento no debe tener mas de 20 caracteres."
                );
            }
            if (this.name.length < 1 || this.name.length > 50) {
                this.validateMessage.push(
                    "El nombre debe tener entre 1-50 caracteres."
                );
            }
            if (this.address.length > 70) {
                this.validateMessage.push(
                    "La dirección no debe tener mas de 70 caracteres."
                );
            }
            if (this.tel.length > 20) {
                this.validateMessage.push(
                    "El teléfono no debe tener mas de 20 caracteres."
                );
            }
            if (this.email.length < 1 || this.email.length > 50) {
                this.validateMessage.push(
                    "El email debe tener entre 1-50 caracteres."
                );
            }
            if (this.validateMessage.length) {
                this.validate = true;
            }
            return this.validate;
        },
        save() {
            let self = this;
            if (self.validateSubmit()) {
                return; // Detener ejecucion si hay errores de validacion
            }
            // editar registro
            axios
                .put("user/update", {
                    _id: this._id,
                    rol: this.rol,
                    name: this.name,
                    typeDni: this.typeDni,
                    numDni: this.numDni,
                    address: this.address,
                    tel: this.tel,
                    email: this.email,
                    password: this.password,
                    customer: this.currentCustomerId
                }, this.configHeader)
                .then(res => {
                    self.getData();
                })
                .catch(err => {
                    console.log(err);
                });
        },
        processUpdatePassword(){
            if(this.newPassword == this.verifyPassword){
                this.password = this.newPassword;
                this.save();
                this.showLogin = true;
            } else {
                this.isPasswordError = true;
                this.passwordError = 'Las contraseñas no coinciden.';
            }
        },
        loginAgain(){
            this.$store.dispatch('LOGOUT');
        },
        getColor(status) {
            if (status == 1) return "teal lighten-2";
            else return "red lighten-4";
        },
    }
  }

</script>
