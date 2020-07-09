<template>
    <v-layout align-start>
        <v-flex>
            <v-data-table :headers="headers" :items="sales" sort-by="name" class :search="search" v-if="!isNew">
                
                <template v-slot:top>
                    <v-toolbar flat color="white">
                    <v-toolbar-title>Ventas</v-toolbar-title>
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

                <template v-slot:item.actions="{ item }">
                    <v-icon class="mr-2" small @click="showEntry(item)">tab</v-icon>
                    <v-icon class="mr-2" small @click="updateVoucher(item)">print</v-icon>
                    <v-btn v-if="item.status" icon color="red" @click="updateStatus(false,item)">
                        <v-icon>block</v-icon>
                    </v-btn>
                    <v-btn v-else icon color="green" @click="updateStatus(true,item)">
                        <v-icon>check</v-icon>
                    </v-btn>
                </template>

                <template v-slot:item.status="{ item }">
                    <v-chip :color="getColor(item.status)" dark>
                        <span v-if="item.status == 1">Aceptado</span>
                        <span v-else>Anulado</span>
                    </v-chip>
                </template>

                <template v-slot:item.createdAt="{ item }">
                    {{ item.createdAt | formatDate}}
                </template>

            </v-data-table>
            
            <v-container grid-list-sm class="pa-4 white" v-if="isNew">
                <v-layout row wrap>
                    <v-flex xs12 sm4 md4 lg4 xl4>
                        <v-select :items="vouchers" v-model="typeVoucher" label="Tipo Comprobante" :disabled="showDetails"></v-select>
                    </v-flex>   
                    <v-flex xs12 sm4 md4 lg4 xl4>
                        <v-text-field v-model="serieVoucher" label="Serie de Comprobante" :disabled="showDetails"></v-text-field>
                    </v-flex>    
                    <v-flex xs12 sm4 md4 lg4 xl4>
                        <v-text-field v-model="numVoucher" label="Numero de Comprobante" :disabled="showDetails"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm8 md8 lg8 xl8>
                        <v-autocomplete :items="people" v-model="person" label="Cliente" :disabled="showDetails"></v-autocomplete>
                    </v-flex>  
                    <v-flex xs12 sm4 md4 lg4 xl4>
                        <v-text-field type="number" v-model="tax" label="Impuesto" :disabled="showDetails"></v-text-field>
                    </v-flex>    
                    <v-flex xs12 sm7 md7 lg7 xl7 v-show="!showDetails">
                        <v-text-field v-model="code" label="Código de producto" @keyup.enter="getProductByCode()"></v-text-field>
                    </v-flex>    
                    <v-flex xs12 sm1 md1 lg1 xl1 v-show="!showDetails">
                        <v-btn color="teal" small fab dark @click="showProductDialog()">
                            <v-icon>list</v-icon>
                        </v-btn>
                    </v-flex>
                    <v-flex xs12 sm4 md4 lg4 xl4 v-show="errorProduct">
                        <v-alert type="error">
                            {{errorProduct}}
                        </v-alert>
                    </v-flex>
                    <v-flex xs12 sm12 md12 lg12 xl12>
                        <template>
                            <v-data-table :headers="headerDetails" :items="entryDetails" class="elevation-1">
                                <template v-slot:item.delete="{ item }" v-if="!showDetails">
                                <v-btn small fab color="red" dark @click="deleteEntryDetail(entryDetails, item)">
                                    <v-icon small>delete</v-icon>
                                </v-btn>
                                </template>
                                <template v-slot:item.price="{ item }">
                                    <v-text-field v-model="item.price" type="number" :disabled="showDetails"></v-text-field>
                                </template>
                                <template v-slot:item.discount="{ item }">
                                    <v-text-field v-model="item.discount" type="number" :disabled="showDetails"></v-text-field>
                                </template>
                                <template v-slot:item.quantity="{ item }">
                                    <v-text-field v-model="item.quantity" type="number" :disabled="showDetails"></v-text-field>
                                </template>
                                <template v-slot:item.subtotal="{ item }">
                                    ${{((item.quantity * item.price) - item.discount).toFixed(2)}} 
                                </template>
                                <template slot="no-data">
                                    <h3>No hay productos agregados al detalle.</h3>
                                </template>
                            </v-data-table>
                            <v-flex class="text-right mt-10">
                                <strong>Total Parcial</strong>: ${{totalPartial = (total-totalTax).toFixed(2)}}
                            </v-flex>
                            <v-flex class="text-right">
                                <strong>Impuestos</strong>: ${{totalTax = ((total*tax)/(1 + tax)).toFixed(2)}}
                            </v-flex>
                            <v-flex class="text-right">
                                <strong>Total neto</strong>: ${{total = calculateTotal.toFixed(2)}}
                            </v-flex>

                            <v-flex xs12 v-show="errorEntries">
                                <v-alert type="error" v-for="error in errorEntries">
                                    {{error}}
                                </v-alert>
                            </v-flex>

                        </template>
                    </v-flex>
                    <v-flex xs12 sm12 md12 lg12 xl12 class="text-right mt-10">
                        <v-btn color="blue darken-5" text @click.prevent="()=> {isNew = !isNew; reset()}">
                        <v-icon class="mr-5" dark>keyboard_backspace</v-icon> Volver a listado de Ingresos</v-btn>
                        <v-btn v-if="!showDetails" color="success" @click.native="saveEntry()">Guardar</v-btn>
                    </v-flex>
                </v-layout>
            </v-container>

            <v-btn class="mx-2" color="green" dark big bottom right fixed fab @click.prevent="()=>{isNew = !isNew; showDetails = false}" v-if="!isNew">
                <v-icon dark>add</v-icon>
            </v-btn>

        </v-flex>

        <v-dialog v-model="productsDialog" max-width="90%">
            <v-card>
              <v-card-title>
                <span class="headline">Seleccione un Producto</span>
              </v-card-title>

              <v-card-text>
                <v-container grid-list-md>
                    <v-layout wrap>
                        <v-flex xs12 sm12 md12 xl12>
                            <v-text-field label="Buscar producto" v-model="text" append-icon="search" class="text-center" @keyup.enter="getProducts()"></v-text-field>
                            <template>
                                <v-data-table :headers="headersProduct" :items="products" sort-by="name" class="elevation-1">

                                    <template v-slot:item.select="{ item }">
                                        <v-btn icon color="green darken-3" fab small @click="addDetails(item)">
                                            <v-icon>add</v-icon>
                                        </v-btn>
                                    </template>

                                    <template v-slot:item.status="{ item }">
                                        <v-chip :color="getColor(item.status)" dark>
                                            <span v-if="item.status == 1">Activo</span>
                                            <span v-else>Inactivo</span>
                                        </v-chip>
                                    </template>

                                </v-data-table>
                            </template>
                        </v-flex>
                    </v-layout>                  
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" dark fab @click="close()">
                  <v-icon color="white">clear</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="showStatusModal" max-width="300">
            <v-card>
                <v-card-text class="text-center pt-5 body-1">
                Esta accion
                <span class="text-decoration-underline">{{statusItemText}}</span> el comprobante
                <span class="font-weight-black">{{statusEntryName}}</span>.
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

        <v-dialog v-model="voucherDialog" scrollable persistent max-width="800px" transition="dialog-transition">
            <v-card>
                <v-card-title primary-title border="bottom" colored-border type="warning" elevation="2">
                    <span>Reporte de Venta</span>
                </v-card-title>

                <v-card-text>
                    <div id="receipt">
                        <section>
                                <table id="facliente">
                                    <tbody>
                                        <tr>
                                            <td id="cliente">
                                                <strong>Sr(a). {{person.name}}</strong><br>
                                                <strong>Documento:</strong> {{person.numDni}}<br>
                                                <strong>Dirección:</strong> {{person.address}}<br>
                                                <strong>Teléfono:</strong> {{person.tel}}<br>
                                                <strong>Email:</strong> {{person.email}}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                <table id="facdetalle">
                                    <tbody>
                                        <tr>
                                                <td>{{typeVoucher}}<br>
                                                {{serieVoucher}} - {{numVoucher}}<br>
                                                {{date}}</td>
                                        </tr>
                                    </tbody>
                                </table>
                        </section>
                        <section>
                            <div>
                                <table id="facarticulo">
                                    <thead>
                                        <tr id="fa">
                                            <th>CANT</th>
                                            <th>DESCRIPCION</th>
                                            <th>PRECIO UNIT</th>
                                            <th>DESC.</th>
                                            <th>PRECIO TOTAL</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="detail in entryDetails" :key="detail._id">
                                            <td style="text-align:center;">{{detail.quantity}}</td>
                                            <td>{{detail.product}}</td>
                                            <td style="text-align:right;">${{detail.price}}</td>
                                            <td style="text-align:right;">${{detail.discount}}</td>
                                            <td style="text-align:right;">${{ (detail.quantity * detail.price) - detail.discount}}</td>
                                        </tr>
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th style="text-align:right;">SUBTOTAL</th>
                                            <th style="text-align:right;">${{totalPartial = (total-totalTax).toFixed(2)}}</th>
                                        </tr>
                                        <tr>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th style="text-align:right;">IVA({{tax}}%)</th>
                                            <th style="text-align:right;">${{totalTax = ((total*tax)/(1 + tax)).toFixed(2)}}</th>
                                        </tr>
                                        <tr>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th style="text-align:right;">TOTAL</th>
                                            <th style="text-align:right;">${{total = calculateTotal.toFixed(2)}}</th>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </section>
                        <footer>
                            <div id="gracias">
                                <p><b>Gracias por su compra!</b></p>
                                <h3><b>{{currentCustomerName}}</b></h3>
                            </div>
                        </footer>
                    </div>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="voucherDialog = false + reset()">Cancelar</v-btn>
                    <v-btn color="brown" dark @click="createPDFVoucher()">
                        <v-icon>print</v-icon>
                    </v-btn> 
                </v-card-actions>

            </v-card>
        </v-dialog>

      </v-layout>
</template>

<script>
import axios from "axios";
import jsPDF from "jspdf";
import htmlCanvas from "html2canvas";
export default {
    data: () => ({
        voucherDialog: false,
        date: '',
        search: "",
        sales: [],
        _id: "",
        person: "",
        people: [],
        typeVoucher: '',
        vouchers: ['FACTURA', 'BOLETA', 'TICKET'],
        serieVoucher: '',
        numVoucher: '',
        tax: 0.21,
        code: '',
        products: [],
        text: '',
        headers: [
            { text: "Estado", value: "status", sortable: true, align: "start" },
            { text: "Usuario", value: "user.name", sortable: true, align: "start" },
            { text: "Cliente", value: "person.name", sortable: true, align: "start" },
            { text: "Tipo de Comprobante", value: "typeVoucher", sortable: true, align: "start" },
            { text: "Serie de Comprobante", value: "serieVoucher", sortable: true, align: "start" },
            { text: "Numero de Comprobante", value: "numVoucher", sortable: true, align: "start" },
            { text: "Fecha", value: "createdAt", sortable: true, align: "start" },
            { text: "Impuesto", value: "tax", sortable: false, align: "start" },
            { text: "Total", value: "total", sortable: true, align: "start" },
            { text: "", value: "actions", sortable: false, align: "start" }
        ],
        productsDialog: false,
        headersProduct: [
            { text: "Seleccionar", value: "select", sortable: false, align: "start" },
            { text: "Codigo", value: "code", sortable: false, align: "start" },
            { text: "Categoria", value: "category.name", sortable: true, align: "start" },
            { text: "Nombre", value: "name", sortable: true, align: "start" },
            { text: "Descripcion", value: "description", sortable: false, align: "start" },
            { text: "Precio", value: "price", sortable: true, align: "start" },
            { text: "Stock", value: "stock", sortable: true, align: "start" },
            { text: "Estado", value: "status", sortable: true, align: "start" }
        ],
        headerDetails: [
            {text: '', value: 'delete', sortable: false},
            {text: 'Producto', value: 'product', sortable: false},
            {text: 'Cantidad', value: 'quantity', sortable: false},
            {text: 'Precio', value: 'price', sortable: false},
            {text: 'Descuento', value: 'discount', sortable: false},
            {text: 'Sub Total', value: 'subtotal', sortable: false},
        ],
        entryDetails: [],
        isNew : false,
        errorProduct: null,
        errorEntries: null,
        total: 0,
        totalPartial: 0,
        totalTax: 0,
        validate: 0,
        validateMessage: [],
        statusItemAction: "",
        showStatusModal: 0,
        showDetails: false,
        statusEntryName: "",
        statusItemText: ""
    }),
    computed: {
        configHeader() {
            let token = this.$store.state.token;
            let header = { "token": this.$store.state.token };
            return { headers: header };
        },
        calculateTotal(){
            let self = this;
            let result = 0.0;
            for(var i = 0; i < self.entryDetails.length; i++){
                result = result + ((self.entryDetails[i].quantity * self.entryDetails[i].price) - self.entryDetails[i].discount)
            }
            return result;
        },
        currentCustomerName(){
            return this.$store.state.user.customerName;
        },
        currentCustomerId(){
            return this.$store.state.user.customerId;
        },
        currentUserId(){
            return this.$store.state.user._id;
        }
    },
    watch: {
        dialog(val) {
            val || this.close();
        }
    },
    created() {
        this.getData();
        this.getPeople();
    },

    methods: {
        getColor(status) {
            if (status == 1) return "teal lighten-2";
            else return "red lighten-4";
        },
        getPeople(){ // get all clients
            let self = this;
            let peopleArray = [];
            axios
                .post("/person/listClients", {customer: this.currentCustomerId}, this.configHeader)
                .then(res => {
                    peopleArray = res.data;
                    peopleArray.map(people => {
                        self.people.push({text: people.name, value: people._id});
                    })
                })
                .catch(err => {
                    console.log(err);
                });
        },
        getProductByCode() { // get products by code
            let self = this;
            self.errorProduct = null;
            axios
                .post("/product/queryCode?code=" + self.code, {customer: this.currentCustomerId}, this.configHeader)
                .then(res => {
                    self.addDetails(res.data);
                })
                .catch(err => {
                    self.errorProduct = "Producto no encontrado."
                });
        },
        getProducts() { // get products by value
            let self = this;
            axios
                .post("/product/list?value=" + this.text, {customer: this.currentCustomerId}, this.configHeader)
                .then(res => {
                    self.products = res.data;
                })
                .catch(err => {
                    console.log(err);
                });
        },
        getDetails(id) { // get details by id
            let self = this;
            axios
                .get("/sale/query?_id=" + id, this.configHeader)
                .then(res => {
                    self.entryDetails = res.data.details;
                })
                .catch(err => {
                    console.log(err);
                });
        },
        showEntry(item){ // Show a Sale
            this.reset();
            this.typeVoucher = item.typeVoucher;
            this.serieVoucher = item.serieVoucher;
            this.numVoucher = item.numVoucher;
            this.person = item.person._id;
            this.tax = item.tax;
            this.getDetails(item._id);
            this.isNew = 1;
            this.showDetails = true;
        },
        showProductDialog() { // Show product dialog
            this.productsDialog = 1;
        },
        addDetails(data){ // add details to Sale
            let productAlreadyExist = this.matchProduct(data._id);
            this.errorProduct = null;
            if(productAlreadyExist) {
                this.errorProduct = "Producto ya agregado.";
            } else {
                this.entryDetails.push(
                    {
                        _id: data._id,
                        product: data.name,
                        quantity: 1,
                        price: data.price,
                        discount: 0
                    }
                );
                this.code = '';
            }
        },
        matchProduct(id){ // Check if product already exist
            let match = false;
            for(var i=0;i<this.entryDetails.length;i++){
                if(this.entryDetails[i]._id == id){
                    match = true;
                }
            }
            return match;
        },
        getData() { // get all sales list
            let self = this;
            axios
                .post("/sale/list", {customer: this.currentCustomerId}, this.configHeader)
                .then(res => {
                    self.sales = res.data;
                })
                .catch(err => {
                    console.log(err);
                });
        },
        deleteEntryDetail(arr,item){ // delete Sale detail
            let index = arr.indexOf(item);
            if(index != -1){
                arr.splice(index,1);
            }
        },
        updateStatus(status, item) { // update status of each Sale
            let self = this;
            self._id = item._id;
            this.showStatusModal = 1;
            this.statusEntryName = item.numVoucher;
            if (status) {
                self.statusItemText = "activará";
                self.statusItemAction = 1;
            } else {
                self.statusItemText = "anulará";
                self.statusItemAction = 0;
            }
        },
        validateSubmit() { // validate before submit new Sale
            this.validate = 0;
            this.errorEntries = [];
            if (!this.person) {
                this.errorEntries.push(
                    "Seleccione un cliente."
                );
            }
            if (!this.typeVoucher) {
                this.errorEntries.push(
                    "Seleccione tipo de comprobante."
                );
            }
            if (!this.numVoucher) {
                this.errorEntries.push(
                    "Ingrese número de comprobante."
                );
            }
            if (!this.serieVoucher.length > 7) {
                this.errorEntries.push(
                    "El número de serie debe ser menor a 7 caracteres."
                );
            }
            if (!this.tax || this.tax < 0 || this.tax > 1) {
                this.errorEntries.push(
                    "Ingrese un impuesto valido."
                );
            }
            if (this.entryDetails.length <= 0) {
                this.errorEntries.push(
                    "Ingrese al menos un producto al detalle."
                );
            }
            if (this.errorEntries.length) {
                this.validate = 1;
            }
            return this.validate;
        },
        close() { // close product dialog
            this.productsDialog = false;
        },
        reset() { // reset all statuses
            this._id = "";
            this.typeVoucher = "";
            this.serieVoucher = "";
            this.numVoucher = "";
            this.person = "";
            this.tax = 0.21;
            this.code = "";
            this.total = 0;
            this.totalPartial = 0;
            this.totalTax = 0;
            this.entryDetails = [];
            this.isNew = 0;
            this.validateMessage = [];
            this.showDetails = false;
        },
        saveEntry() { // save new Sale
            let self = this;
            if (self.validateSubmit()) {
                console.log('errores', self.validateMessage)
                return; // Detener ejecucion si hay errores de validacion
            }
            // agregar registro
            axios
                .post("sale/add", {
                    customer: this.currentCustomerId,
                    person: this.person,
                    user: this.currentUserId,
                    typeVoucher: this.typeVoucher,
                    serieVoucher: this.serieVoucher,
                    numVoucher: this.numVoucher,
                    tax: this.tax,
                    total: this.total,
                    details: this.entryDetails
                }, this.configHeader)
                .then(res => {
                    self.reset();
                    self.close();
                    self.getData();
                })
                .catch(err => {
                    console.log(err);
                });
        },
        closeStatusModal() { // close status dialog
            this.showStatusModal = !this.showStatusModal;
            this.reset();
        },
        processUpdateStatus() { // trigger activate/deactivate entries
            if (this.statusItemAction == 0) {
                this.deactivate();
            }
            if (this.statusItemAction == 1) {
                this.activate();
            }
        },
        activate() { // activate a Sale
            let self = this;
            axios
                .put("sale/activate", {
                    _id: this._id
                }, this.configHeader)
                .then(res => {
                    self.showStatusModal = 0;
                    self.statusEntryName = "";
                    self.statusItem = "";
                    self.getData();
                })
                .catch(err => {
                    console.log(err);
                });
        },
        deactivate() { // deactivate a Sale
            let self = this;
            axios
                .put("sale/deactivate", {
                    _id: this._id
                }, this.configHeader)
                .then(res => {
                    self.showStatusModal = 0;
                    self.statusEntryName = "";
                    self.statusItemText = "";
                    self.getData();
                })
                .catch(err => {
                    console.log(err);
                });
        },
        updateVoucher(item){
            this.reset();
            this.typeVoucher = item.typeVoucher;
            this.serieVoucher = item.serieVoucher;
            this.numVoucher = item.numVoucher;
            this.date = item.createdAt;
            this.person = item.person;
            this.tax = item.tax;
            this.getDetails(item._id);
            this.voucherDialog = true;
        },
        createPDFVoucher(){
            var self = this;
            var quotes = document.getElementById('receipt');
            htmlCanvas(quotes).then( canvas => {
                var imgData = canvas.toDataURL('image/png');
                var imgWidth = 200;
                var pageHeight = 295;
                var imgHeight = canvas.height * imgWidth / canvas.width;
                var heightLeft = imgHeight;

                var doc = new jsPDF('p', 'mm', 'a4');
                var position = 5;

                doc.addImage(imgData, 'PNG', 5, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                while(heightLeft >= 0){
                    position: heightLeft - imgHeight;
                    doc.addPage();
                    doc.addImage(imgData, 'PNG', 5, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }
                doc.save('comprobante.pdf');
                self.voucherDialog = false;
                self.reset();
            })
        }
    }
};
</script>

<style scooped>
    #factura {
        padding: 20px;
        font-family: Arial, sans-serif;
        font-size: 16px ;
    }

    #logo {
        float: left;
        margin-left: 2%;
        margin-right: 2%;
    }
    #imagen {
        width: 100px;
    }

    #fact {
        font-size: 18px;
        font-weight: bold;
        text-align: center;
    }   

    #datos {
        float: left;
        margin-top: 0%;
        margin-left: 2%;
        margin-right: 2%;
        /*text-align: justify;*/
    }

    #encabezado {
        text-align: center;
        margin-left: 10px;
        margin-right: 10px;
        font-size: 16px;
    }

    section {
        clear: left;
    }

    #cliente {
        text-align: left;
    }

    #facliente {
        width: 60%;
        border-collapse: collapse;
        border-spacing: 0;
        margin-bottom: 15px;
        float: left;
    }

    #facdetalle{
        width: 40%;
        border-collapse: collapse;
        border-spacing: 0;
        margin-bottom: 15px;
    }

    #fa {
        color: #FFFFFF;
        font-size: 14px;
    }

    #facarticulo {
        width: 100%;
        border-collapse: collapse;
        border-spacing: 0;
        padding: 20px;
        margin-bottom: 15px;
    }

    #facarticulo thead {
        padding: 20px;
        background: #2183E3;
        text-align: center;
        border-bottom: 1px solid #FFFFFF;
    }

    #gracias {
        text-align: center;
    }
</style>