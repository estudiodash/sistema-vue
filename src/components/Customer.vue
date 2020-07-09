<template>
    <v-layout align-start>
        <v-flex>
            <v-data-table :headers="headers" :items="people" sort-by="name" class :search="search">
                <template v-slot:top>
                    <v-toolbar flat color="white">
                    <v-toolbar-title>Clientes</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-text-field
                        v-model="search"
                        append-icon="search"
                        label="Filtrar"
                        single-line
                        hide-details
                    ></v-text-field>
                    </v-toolbar>
                </template>

                    <template v-slot:item.status="{ item }">
                        <v-chip :color="getColor(item.status)" dark>
                            <span v-if="item.status == 1">Activo</span>
                            <span v-else>Inactivo</span>
                        </v-chip>
                    </template>

                    <template v-slot:item.actions="{ item }">
                        <v-btn icon color="orange" @click="editItem(item)">
                            <v-icon>create</v-icon>
                        </v-btn>
                        
                        <v-btn v-if="item.status" icon color="red" @click="updateStatus(false,item)">
                            <v-icon>block</v-icon>
                        </v-btn>
                        
                        <v-btn v-else icon color="green" @click="updateStatus(true,item)">
                            <v-icon>check</v-icon>
                        </v-btn>
                    </template>
                                </v-data-table>
                            </v-flex>

                            <v-dialog v-model="dialog" max-width="650px">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn class="mx-2" color="green" dark big bottom right fixed fab v-bind="attrs" v-on="on">
                            <v-icon dark>add</v-icon>
                        </v-btn>
                    </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{formTitle}}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    
                    <v-flex xs12 sm6 md6>
                      <v-text-field v-model="name" label="Razón Social"></v-text-field>
                    </v-flex>

                    <v-flex xs12 sm6 md6 class="pl-3">
                      <v-select :items="listDoc" v-model="typeDni" label="Tipo Documento"></v-select>
                    </v-flex>

                    <v-flex xs12 sm6 md6>
                      <v-text-field v-model="numDni" label="Número de Documento"></v-text-field>
                    </v-flex>

                    <v-flex xs12 sm6 md6 class="pl-3">
                      <v-text-field v-model="address" label="Dirección"></v-text-field>
                    </v-flex>

                    <v-flex xs12 sm6 md6>
                      <v-text-field v-model="tel" label="Teléfono"></v-text-field>
                    </v-flex>

                    <v-flex xs12 sm6 md6 class="pl-3">
                      <v-text-field v-model="email" label="Email"></v-text-field>
                    </v-flex>

                    <v-flex xs12>
                      <div
                        class="red--text"
                        v-for="errorMessage in validateMessage"
                        :key="errorMessage"
                      >{{errorMessage}}</div>
                    </v-flex>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn color="red" dark fab @click="close()">
                  <v-icon color="white">clear</v-icon>
                </v-btn>
                <v-btn color="green" dark fab @click="save()">
                  <v-icon color="white">check</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog v-model="showStatusModal" max-width="300">
            <v-card>
              <v-card-text class="text-center pt-5 body-1">
                Esta accion
                <span class="text-decoration-underline">{{statusItemText}}</span>  cliente
                <span class="font-weight-black">{{statusCategoryName}}</span>.
                <p class="mt-5">¿Confirma los cambios?</p>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" dark fab @click="closeStatusModal()">
                  <v-icon color="white">clear</v-icon>
                </v-btn>
                <v-btn color="green" dark fab @click="processUpdateStatus()">
                  <v-icon color="white">check</v-icon>
                </v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
      </v-layout>
</template>

<script>
import axios from "axios";
export default {
    data: () => ({
        dialog: false,
        search: "",
        people: [],
        headers: [
            { text: "", value: "actions", sortable: false, align: "start" },
            { text: "Nombre", value: "name", sortable: true, align: "start" },
            //{ text: "Tipo", value: "typePerson", sortable: true, align: "start" },
            { text: "Tipo de Documento", value: "typeDni", sortable: true, align: "start" },
            { text: "Numero de Documento", value: "numDni", sortable: true, align: "start" },
            { text: "Dirección", value: "address", sortable: true, align: "start" },
            { text: "Teléfono", value: "tel", sortable: false, align: "start" },
            { text: "Email", value: "email", sortable: true, align: "start" },
            { text: "Estado", value: "status", sortable: true, align: "start" }
        ],
        editedIndex: -1,
        _id: "",
        name: "",
        typePerson: 'client',
        typeDni: '',
        listDoc: ['DNI', 'Pasaporte', 'CUIT'],
        numDni: '',
        address: '',
        tel: '',
        email: '',
        validate: 0,
        validateMessage: [],
        statusItemAction: "",
        showStatusModal: 0,
        statusCategoryName: "",
        statusItemText: ""
    }),
    computed: {
        formTitle() {
            return this.editedIndex === -1 ? "Nuevo registro" : "Editar Registo";
        },
        configHeader() {
            let token = this.$store.state.token;
            let header = { "token": this.$store.state.token };
            return { headers: header };
        },
        currentCustomerId(){
            return this.$store.state.user.customerId;
        }
    },
    watch: {
        dialog(val) {
            val || this.close();
        }
    },
    created() {
        this.getData();
    },

    methods: {
        getColor(status) {
            if (status == 1) return "teal lighten-2";
            else return "red lighten-4";
        },
        getData() {
            let self = this;
            axios
                .post("/person/listClients", {customer : this.currentCustomerId}, this.configHeader)
                .then(res => {
                    self.people = res.data;
                })
                .catch(err => {
                    console.log(err);
                });
        },
        editItem(item) {
            this._id = item._id;
            this.typePerson = item.typePerson;
            this.name = item.name;
            this.typeDni = item.typeDni;
            this.numDni = item.numDni;
            this.address = item.address;
            this.tel = item.tel;
            this.email = item.email;
            this.dialog = true;
            this.editedIndex = 1;
        },
        updateStatus(status, item) {
            let self = this;
            self._id = item._id;
            this.showStatusModal = 1;
            this.statusCategoryName = item.name;
            if (status) {
                self.statusItemText = "activará";
                self.statusItemAction = 1;
            } else {
                self.statusItemText = "desctivará";
                self.statusItemAction = 0;
            }
        },
        validateSubmit() {
            this.validate = 0;
            this.validateMessage = [];
            if (!this.typeDni) {
                this.validateMessage.push(
                    "Seleccione un tipo de documento."
                );
            }
            if (this.numDni.length > 20) {
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
            if (this.email.length > 50) {
                this.validateMessage.push(
                    "El email debe tener menos de 50 caracteres."
                );
            }
            if (this.validateMessage.length) {
                this.validate = 1;
            }
            return this.validate;
        },
        close() {
            this.dialog = false;
            this.reset();
        },
        reset() {
            this._id = "";
            this.name = "";
            this.typeDni = "";
            this.numDni = "";
            this.address = "";
            this.tel = "";
            this.email = "";
            this.validate = 0;
            this.validateMessage = [];
            this.editedIndex = -1;
        },
        save() {
            let self = this;
            if (self.validateSubmit()) {
                return; // Detener ejecucion si hay errores de validacion
            }
            if (this.editedIndex > -1) {
                // editar registro
                axios
                    .put("person/update", {
                        _id: this._id,
                        customer: this.currentCustomerId,
                        typePerson: this.typePerson,
                        name: this.name,
                        typeDni: this.typeDni,
                        numDni: this.numDni,
                        address: this.address,
                        tel: this.tel,
                        email: this.email,
                    }, this.configHeader)
                    .then(res => {
                        self.reset();
                        self.close();
                        self.getData();
                    })
                    .catch(err => {
                        console.log(err);
                    });
            } else {
                // guardar nuevo registro
                axios
                    .post("person/add", {
                        customer: this.currentCustomerId,
                        typePerson: this.typePerson,
                        name: this.name,
                        typeDni: this.typeDni,
                        numDni: this.numDni,
                        address: this.address,
                        tel: this.tel,
                        email: this.email,
                    }, this.configHeader)
                    .then(res => {
                        self.reset();
                        self.close();
                        self.getData();
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        },
        closeStatusModal() {
            this.showStatusModal = !this.showStatusModal;
            this.reset();
        },
        processUpdateStatus() {
            if (this.statusItemAction == 0) {
                this.deactivate();
            }
            if (this.statusItemAction == 1) {
                this.activate();
            }
        },
        activate() {
            // activar registro
            let self = this;
            axios
                .put("person/activate", {
                    _id: this._id
                }, this.configHeader)
                .then(res => {
                    self.showStatusModal = 0;
                    self.statusCategoryName = "";
                    self.statusItem = "";
                    self.getData();
                })
                .catch(err => {
                    console.log(err);
                });
        },
        deactivate() {
            // desactivar registro
            let self = this;
            axios
                .put("person/deactivate", {
                    _id: this._id
                }, this.configHeader)
                .then(res => {
                    self.showStatusModal = 0;
                    self.statusCategoryName = "";
                    self.statusItemText = "";
                    self.getData();
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }
};
</script>