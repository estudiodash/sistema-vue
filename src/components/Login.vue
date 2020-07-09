<template>
    <v-container bg fill-height grid-list-md text-xs-center>

        <v-flex x12 sm8 md6 x14>
            <v-card>
                <v-toolbar dark color="blue darken-3">
                    <v-toolbar-title>Acceso al sistema</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <v-text-field prepend-icon="email" v-model="email" name="email" label="email" color="accent" autofocus required></v-text-field>
                    <v-text-field prepend-icon="lock" v-model="password" type="password" label="password" color="accent" autofocus required></v-text-field>
                    <v-flex v-if="errorMessage" class="red--text" text-center>
                        {{errorMessage}}
                    </v-flex>
                </v-card-text>
                <v-card-actions class="px-3 pb-3">
                    <v-flex text-center>
                        <v-btn color="success" @click="login()">Login</v-btn>
                    </v-flex>
                </v-card-actions>
            </v-card>
        </v-flex>
        
    </v-container>
</template>

<script>
import axios from 'axios';
export default {
    data(){
        return {
            email: '',
            password: '',
            errorMessage: null,
        }
    },
    methods: {
        login(){
            axios.post('user/login', {email: this.email, password: this.password}).then(res => {
                return res.data;
            })
            .then(data => {
                this.$store.dispatch('SAVE_TOKEN', data.tokenReturn);
                this.$router.push({name: 'home'});
            })
            .catch(err => {
                console.log(err)
                this.errorMessage = null;
                if(err.response.status == 404){
                    this.errorMessage = 'No existe el usuario o las credenciales son incorrectas.'
                } else {
                    this.errorMessage = 'Error del servidor. Contacte al administrador del sistema.'
                }
            })
        }
    }
}
</script>
