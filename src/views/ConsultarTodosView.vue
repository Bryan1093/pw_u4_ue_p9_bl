<template>
  <div class="container">
    <h2>Consultar Todos los Estudiantes</h2>

    <div class="section">
      <button @click="consultarTodos" class="btn-primary">Cargar Todos</button>
    </div>

    <h3>Listado de Estudiantes</h3>
    <table
      border="1"
      cellspacing="0"
      cellpadding="5"
      v-if="estudiantes.length > 0"
    >
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Fecha Nacimiento</th>
          <th>Provincia</th>
          <th>Género</th>
          <th>Hijos</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="e in estudiantes" :key="e.id">
          <td>{{ e.id }}</td>
          <td>{{ e.nombre }}</td>
          <td>{{ e.apellido }}</td>
          <td>{{ formatFecha(e.fechaNacimiento) }}</td>
          <td>{{ e.provincia || "N/A" }}</td>
          <td>{{ e.genero || "N/A" }}</td>
          <td>
            <ul>
              <li v-for="h in e.hijos || []" :key="h.id">
                {{ h.nombre }} ({{ h.edad || "años" }})
              </li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else class="message">No hay estudiantes para mostrar</p>
  </div>
</template>

<script>
import { consultarTodosFachada } from "@/clients/matricula.js";

export default {
  name: "ConsultarTodosView",
  data() {
    return {
      estudiantes: [],
    };
  },
  methods: {
    async consultarTodos() {
      try {
        const datos = await consultarTodosFachada();
        // Para cada estudiante, cargar sus hijos desde la API
        for (const est of datos) {
          est.hijos = await this.consultarHijos(est.id);
        }
        this.estudiantes = datos;
        console.log("Todos:", datos);
      } catch (error) {
        console.error(error);
        console.warn("Error al consultar estudiantes");
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

  mounted() {
    this.consultarTodos();
  },
};
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: auto;
  padding: 20px;
}

.section {
  margin-bottom: 15px;
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

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f0f0f0;
  font-weight: bold;
}

tr:hover {
  background-color: #f9f9f9;
}

.message {
  color: #666;
  font-style: italic;
  margin-top: 20px;
}
</style>
