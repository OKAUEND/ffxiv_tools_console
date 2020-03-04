<template>
  <div>
    <div>
      <input type="text" placeholder="E-mail" v-model="email" />
    </div>
    <div>
      <input type="text" placeholder="Password" v-model="password" />
    </div>
    <button @click="singinConsole">Sing in</button>
  </div>
</template>

<script>
import firebase from "@/firebase.js";
export default {
  name: "Singin",
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    singinConsole() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          this.$router.push("/Console/LogRegister");
        })
        .catch(error => {
          console.error(error);
          this.$router.push("/");
        });
    }
  }
};
</script>

<style></style>
