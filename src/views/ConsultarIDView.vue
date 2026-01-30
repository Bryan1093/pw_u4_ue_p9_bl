<template>
  <div class="container">
    <h2>Consultar Estudiante por ID</h2>

    <div class="section">
      <input
        v-model.number="id"
        type="number"
        placeholder="Ingrese el ID del estudiante"
      />
      <button @click="consultarPorID" class="btn-primary">Consultar</button>
    </div>

    <div v-if="estudiante.id" class="student-info">
      <h3>Información del Estudiante</h3>
      <table border="1" cellspacing="0" cellpadding="5">
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
          <tr v-if="estudiante.hijos && estudiante.hijos.length > 0">
            <th>Hijos</th>
            <td>
              <ul>
                <li v-for="h in estudiante.hijos" :key="h.id">
                  {{ h.nombre }} ({{ h.edad || "años" }})
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else class="message">Ingrese un ID y presione consultar</p>
  </div>
</template>

<script>
import { consultarPorIDFachada } from "@/clients/matricula.js";
export default {
  name: "ConsultarIDView",
  data() {
    return {
      id: null,
      estudiante: {},
    };
  },
  methods: {
    async consultarPorID() {
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
        // Traer hijos
        datos.hijos = await this.consultarHijos(datos.id);
        this.estudiante = datos;
        console.log("Por ID:", datos);
      } catch (error) {
        console.error(error);
        console.warn("Error al consultar estudiante");
      }
    },

    async consultarHijos(estudianteId) {
      try {
        const response = await fetch(
          `http://localhost:8081/matricula/api/v1.0/estudiantes/${estudianteId}/hijos`,
        );
        if (!response.ok) {
          return [];
        }
        const hijos = await response.json();
        return hijos;
      } catch (error) {
        console.error("Error cargando hijos:", error);
        return [];
      }
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
  max-width: 800px;
  margin: auto;
  padding: 20px;
}

.section {
  margin-bottom: 20px;
}

input {
  display: block;
  margin-bottom: 10px;
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.btn-primary {
  padding: 8px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: #0056b3;
}

h2,
h3 {
  color: #333;
}

.student-info {
  margin-top: 30px;
}

table {
  width: 100%;
  border-collapse: collapse;
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

.message {
  color: #666;
  font-style: italic;
  margin-top: 20px;
}
</style>
