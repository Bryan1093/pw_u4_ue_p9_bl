<template>
  <div class="container">
    <h2>Actualizar Estudiante</h2>

    <div class="section">
      <h3>Buscar Estudiante</h3>
      <div class="search-group">
        <input
          v-model.number="id"
          type="number"
          placeholder="ID del estudiante"
        />
        <button @click="buscarEstudiante" class="btn-info">Buscar</button>
      </div>
    </div>

    <div v-if="estudiante.id" class="form-section">
      <h3>Actualizar Datos</h3>
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
        <button @click="actualizar" class="btn-success">Actualizar</button>
        <button @click="limpiarFormulario" class="btn-secondary">
          Cancelar
        </button>
      </div>
    </div>
    <p v-else class="message">Busque un estudiante para actualizar</p>
  </div>
</template>

<script>
import {
  consultarPorIDFachada,
  actualizarFachada,
} from "@/clients/matricula.js";

export default {
  name: "ActualizarView",
  data() {
    return {
      id: null,
      estudiante: {},
    };
  },
  methods: {
    async buscarEstudiante() {
      if (!this.id) {
        console.warn("Por favor ingresa un ID");
        return;
      }
      try {
        const datos = await consultarPorIDFachada(this.id);
        if (!datos || !datos.id) {
          console.warn("Estudiante no encontrado");
          return;
        }
        this.cargarEstudianteEnFormulario(datos);
        console.log("Estudiante cargado:", datos);
      } catch (error) {
        console.error(error);
        console.warn("Error al buscar estudiante");
      }
    },

    cargarEstudianteEnFormulario(est) {
      this.id = est.id;
      this.estudiante.id = est.id;
      this.estudiante.nombre = est.nombre || "";
      this.estudiante.apellido = est.apellido || "";
      // Transformar fecha a formato datetime-local yyyy-MM-ddTHH:mm para que funcione input
      if (est.fechaNacimiento) {
        this.estudiante.fechaNacimiento = est.fechaNacimiento.substring(0, 16);
      } else {
        this.estudiante.fechaNacimiento = "";
      }
      this.estudiante.provincia = est.provincia || "";
      this.estudiante.genero = est.genero || "";
    },

    async actualizar() {
      if (!this.id) {
        console.warn("Por favor selecciona un estudiante para actualizar");
        return;
      }
      try {
        let fecha = this.estudiante.fechaNacimiento;
        if (fecha && fecha.length === 16) {
          fecha += ":00";
        }
        const body = {
          nombre: this.estudiante.nombre,
          apellido: this.estudiante.apellido,
          fechaNacimiento: fecha,
          provincia: this.estudiante.provincia,
          genero: this.estudiante.genero,
        };
        const resp = await actualizarFachada(this.id, body);
        console.log("PUT - body enviado:", body);
        console.log("PUT - respuesta:", resp);
        // Recargar estudiante para reflejar cambios en la UI
        try {
          const actualizado = await consultarPorIDFachada(this.id);
          console.log("PUT - estudiante recargado:", actualizado);
          // Si la provincia fue enviada pero el servidor devuelve otra, lo registramos
          if (
            body &&
            body.provincia !== undefined &&
            actualizado &&
            actualizado.provincia !== body.provincia
          ) {
            console.warn(
              "La provincia en el servidor no coincide con la enviada",
              { enviada: body.provincia, servidor: actualizado.provincia },
            );
          }
          this.cargarEstudianteEnFormulario(actualizado);
          console.info("Estudiante actualizado con éxito");
        } catch (e) {
          console.error("Actualizado pero error recargando:", e);
        }
      } catch (error) {
        console.error(error);
        console.warn("Error al actualizar estudiante");
      }
    },

    limpiarFormulario() {
      this.id = null;
      this.estudiante = {};
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

.section {
  margin-bottom: 25px;
}

.search-group {
  display: flex;
  gap: 10px;
}

.search-group input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
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
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
}

.btn-info {
  background-color: #17a2b8;
  color: white;
}

.btn-info:hover {
  background-color: #138496;
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

.message {
  color: #666;
  font-style: italic;
  margin-top: 20px;
}
</style>
