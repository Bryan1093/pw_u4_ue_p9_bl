<template>
  <div class="login-container">
    <h1>Iniciar Sesión</h1>
    <div class="form-group">
      <label for="username">Usuario:</label>
      <input type="text" id="username" v-model="username" placeholder="Ingrese su usuario" />
    </div>
    <div class="form-group">
      <label for="password">Contraseña:</label>
      <input type="password" id="password" v-model="password" placeholder="Ingrese su contraseña" />
    </div>
    <button @click="login" class="btn-login">Login</button>
    <p v-if="error" class="message error">{{ error }}</p>
    <p v-if="success" class="message success">{{ success }}</p>
  </div>
</template>

<script>
import { loginFachada } from "@/clients/AuthClient";

export default {
  data() {
    return {
      username: "",
      password: "",
      error: null,
      success: null,
    };
  },
  methods: {
    async login() {
      try {
        this.error = null;
        this.success = null;
        const data = await loginFachada(this.username, this.password);
        if (data && data.accessToken) {
          localStorage.setItem("token", data.accessToken);
          localStorage.setItem("role", data.role);
          this.success = "¡Login exitoso! Redirigiendo...";

          setTimeout(() => {
            this.$router.push("/");
          }, 1500);
        }
      } catch (err) {
        console.error(err);
        this.error = "Credenciales incorrectas o error de conexión";
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

.btn-login {
  width: 100%;
  padding: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.btn-login:hover {
  background-color: #3aa876;
}

.message {
  margin-top: 15px;
  padding: 10px;
  border-radius: 4px;
  font-weight: bold;
}

.error {
  background-color: #ffebee;
  color: #c62828;
  border: 1px solid #ef9a9a;
}

.success {
  background-color: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #a5d6a7;
}
</style>
