<template>
  <div class="container">
    <h2>Actualización Parcial de Estudiante</h2>

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
      <h3>Actualizar Datos (Solo los campos que desees)</h3>
      <p class="hint">Deja en blanco los campos que no desees modificar</p>

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
          <option value="">Dejar igual</option>
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
          <option value="No-binario">No-binario</option>
          <option value="pansexual">Pansexual</option>
        </select>
      </div>
      <div class="button-group">
        <button @click="actualizarParcial" class="btn-success">
          Actualizar Parcialmente
        </button>
        <button @click="limpiarFormulario" class="btn-secondary">
          Cancelar
        </button>
      </div>
    </div>
    <p v-else class="message">
      Busque un estudiante para actualizar parcialmente
    </p>
  </div>
</template>

<script>
import {
  consultarPorIDFachada,
  actualizarParcialFachada,
} from "@/clients/matricula.js";

export default {
  name: "ActualizarParcialView",
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

    async actualizarParcial() {
      if (!this.id) {
        console.warn("Por favor selecciona un estudiante para actualizar");
        return;
      }
      try {
        let fecha = this.estudiante.fechaNacimiento;
        if (fecha && fecha.length === 16) {
          fecha += ":00";
        }

        // Construir objeto con solo los campos modificados
        const body = {};
        if (this.estudiante.nombre) body.nombre = this.estudiante.nombre;
        if (this.estudiante.apellido) body.apellido = this.estudiante.apellido;
        if (fecha) body.fechaNacimiento = fecha;
        if (this.estudiante.provincia)
          body.provincia = this.estudiante.provincia;
        if (this.estudiante.genero) body.genero = this.estudiante.genero;

        // Usar la fachada para PATCH
        const resp = await actualizarParcialFachada(this.id, body);
        console.log("PATCH - body enviado:", body);
        console.log("PATCH - respuesta:", resp);

        // Recargar estudiante para reflejar cambios en la UI
        try {
          const actualizado = await consultarPorIDFachada(this.id);
          console.log("PATCH - estudiante recargado:", actualizado);
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
          console.info("Estudiante actualizado parcialmente con éxito");
        } catch (e) {
          console.error("Actualizado pero error recargando:", e);
        }
      } catch (error) {
        console.error(error);
        console.warn("Error al actualizar estudiante parcialmente");
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

.hint {
  color: #666;
  font-size: 14px;
  font-style: italic;
  margin-bottom: 15px;
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
