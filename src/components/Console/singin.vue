<template>
  <div>
    <div>
      <input type="text" placeholder="E-mail" v-model="email" />
    </div>
    <div>
      <input
        type="password"
        autocomplete="off"
        placeholder="Password"
        v-model="password"
      />
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
          console.log("Success");
          this.$router.push("/Console");
        })
        .catch(error => {
          console.error({ error });
          this.$router.push("/");
        });
    }
  }
};
</script>

<style></style>
