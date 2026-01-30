<template>
  <div class="container">
    <h2>Guardar Nuevo Estudiante</h2>

    <div class="form-section">
      <h3>Datos del Estudiante</h3>
      <div class="form-group">
        <label>Nombre:</label>
        <input v-model="estudiante.nombre" placeholder="Nombre" />
      </div>
      <div class="form-group">
        <label>Apellido:</label>
        <input v-model="estudiante.apellido" placeholder="Apellido" />
      </div>
      <div class="form-group">
        <label>Fecha de Nacimiento:</label>
        <input v-model="estudiante.fechaNacimiento" type="datetime-local" />
      </div>
      <div class="form-group">
        <label>Provincia:</label>
        <input v-model="estudiante.provincia" placeholder="Provincia" />
      </div>
      <div class="form-group">
        <label>Género:</label>
        <select v-model="estudiante.genero">
          <option disabled value="">Seleccione género</option>
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
          <option value="No-binario">No-binario</option>
          <option value="pansexual">Pansexual</option>
        </select>
      </div>
      <div class="button-group">
        <button @click="guardar" class="btn-success">Guardar Estudiante</button>
        <button @click="limpiarFormulario" class="btn-secondary">
          Limpiar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { guardarFachada } from "@/clients/matricula.js";

export default {
  name: "GuardarView",
  data() {
    return {
      estudiante: {
        nombre: "",
        apellido: "",
        fechaNacimiento: "",
        provincia: "",
        genero: "",
        hijos: [],
      },
    };
  },
  methods: {
    async guardar() {
      if (!this.estudiante.nombre || !this.estudiante.apellido) {
        console.warn("Por favor completa los campos requeridos");
        return;
      }

      if (!this.estudiante.fechaNacimiento) {
        console.warn("Por favor selecciona una fecha válida.");
        return;
      }

      // Si el datetime-local no incluye segundos, añádelos manualmente:
      let fecha = this.estudiante.fechaNacimiento;
      if (fecha.length === 16) {
        // yyyy-MM-ddTHH:mm
        fecha += ":00"; // yyyy-MM-ddTHH:mm:ss
      }

      const body = {
        ...this.estudiante,
        fechaNacimiento: fecha,
      };

      try {
        const datos = await guardarFachada(body);
        console.info("Estudiante guardado con éxito");
        console.log(datos);
        this.limpiarFormulario();
      } catch (error) {
        console.error(error);
        console.warn("Error al guardar el estudiante");
      }
    },

    limpiarFormulario() {
      this.estudiante = {
        nombre: "",
        apellido: "",
        fechaNacimiento: "",
        provincia: "",
        genero: "",
        hijos: [],
      };
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
}

h2,
h3 {
  color: #333;
}

.form-section {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

input,
select {
  display: block;
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

input:focus,
select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

button {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
}

.btn-success {
  background-color: #28a745;
  color: white;
}

.btn-success:hover {
  background-color: #218838;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}
</style>
