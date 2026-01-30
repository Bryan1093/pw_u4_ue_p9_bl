<template>
  <div class="container">
    <h2>Eliminar Estudiante</h2>

    <div class="warning-box">
      <p>
        <strong>Advertencia:</strong> Esta acción no se puede deshacer. Eliminar
        un estudiante lo borrará permanentemente de la base de datos.
      </p>
    </div>

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

    <div v-if="estudiante.id" class="info-section">
      <h3>Confirmación de Eliminación</h3>
      <table border="1" cellspacing="0" cellpadding="5" class="info-table">
        <tbody>
          <tr>
            <th>ID</th>
            <td>{{ estudiante.id }}</td>
          </tr>
          <tr>
            <th>Nombre</th>
            <td>{{ estudiante.nombre }}</td>
          </tr>
          <tr>
            <th>Apellido</th>
            <td>{{ estudiante.apellido }}</td>
          </tr>
          <tr>
            <th>Fecha Nacimiento</th>
            <td>{{ formatFecha(estudiante.fechaNacimiento) }}</td>
          </tr>
          <tr>
            <th>Provincia</th>
            <td>{{ estudiante.provincia || "N/A" }}</td>
          </tr>
          <tr>
            <th>Género</th>
            <td>{{ estudiante.genero || "N/A" }}</td>
          </tr>
        </tbody>
      </table>

      <div class="confirmation-box">
        <p>¿Estás seguro de que deseas eliminar este estudiante?</p>
        <div class="button-group">
          <button @click="eliminar" class="btn-danger">Sí, Eliminar</button>
          <button @click="limpiarFormulario" class="btn-secondary">
            Cancelar
          </button>
        </div>
      </div>
    </div>
    <p v-else class="message">Busque un estudiante para eliminarlo</p>
  </div>
</template>

<script>
import { consultarPorIDFachada, eliminarFachada } from "@/clients/matricula.js";

export default {
  name: "EliminarView",
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
        this.estudiante = datos;
        console.log("Estudiante encontrado:", datos);
      } catch (error) {
        console.error(error);
        console.warn("Error al buscar estudiante");
      }
    },

    async eliminar() {
      if (!this.id) {
        console.warn("Por favor selecciona un estudiante para eliminar");
        return;
      }

      // Ya existe una confirmación visual en la vista (botón "Sí, Eliminar"),
      // así que eliminamos el popup nativo confirm(). Procedemos con la eliminación.
      try {
        await eliminarFachada(this.id);
        console.info("Estudiante eliminado con éxito");
        this.limpiarFormulario();
      } catch (error) {
        console.error(error);
        console.warn("Error al eliminar estudiante");
      }
    },

    limpiarFormulario() {
      this.id = null;
      this.estudiante = {};
    },

    formatFecha(fecha) {
      if (!fecha) return "N/A";
      return fecha.substring(0, 16).replace("T", " ");
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 700px;
  margin: auto;
  padding: 20px;
}

h2,
h3 {
  color: #333;
}

.warning-box {
  background-color: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 25px;
  color: #856404;
}

.warning-box p {
  margin: 0;
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

.info-section {
  margin-top: 25px;
}

.info-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th,
td {
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
}

th {
  background-color: #f0f0f0;
  font-weight: bold;
}

.confirmation-box {
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  padding: 15px;
  margin-top: 15px;
}

.confirmation-box p {
  color: #721c24;
  margin-bottom: 15px;
}

.button-group {
  display: flex;
  gap: 10px;
}

button {
  padding: 10px 15px;
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

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
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
