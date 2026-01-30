<template>
  <div class="container">
    <h2>Consultar Todos los Estudiantes</h2>

    <!-- Mensajes de Alerta -->
    <div v-if="mensajeExito" class="alert alert-success">
      {{ mensajeExito }}
    </div>
    <div v-if="mensajeError" class="alert alert-danger">
      {{ mensajeError }}
    </div>

    <div class="section">
      <button @click="consultarTodos" class="btn-primary">Recargar Todos</button>
    </div>

    <h3>Listado de Estudiantes</h3>
    <table border="1" cellspacing="0" cellpadding="5" v-if="estudiantes.length > 0">
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
            <ul v-if="e.hijos && e.hijos.length">
              <li v-for="h in e.hijos" :key="h.id">
                {{ h.nombre }} {{ h.apellido }}
              </li>
            </ul>
            <span v-else>Sin hijos</span>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else class="message">No hay estudiantes para mostrar o aún no se han cargado.</p>
  </div>
</template>

<script>
import { consultarTodosFachada } from "@/clients/matricula.js";

export default {
  name: "ConsultarTodosView",
  data() {
    return {
      estudiantes: [],
      mensajeExito: "",
      mensajeError: "",
    };
  },
  methods: {
    mostrarExito(msg) {
      this.mensajeExito = msg;
      this.mensajeError = "";
      setTimeout(() => {
        this.mensajeExito = "";
      }, 5000);
    },
    mostrarError(msg) {
      this.mensajeError = msg;
      this.mensajeExito = "";
      setTimeout(() => {
        this.mensajeError = "";
      }, 5000);
    },
    async consultarTodos() {
      try {
        const datos = await consultarTodosFachada();

        // Cargar hijos si no vienen en la respuesta principal
        // CORRECCIÓN: Si el backend ya retorna los hijos (como lo hicimos en EstudianteResource),
        // no necesitamos llamar uno por uno. Pero si se quiere asegurar, se puede mantener.
        // Dado el cambio en el backend, es probable que ya vengan, pero por seguridad, 
        // verificamos si 'hijos' ya tiene datos.

        for (const est of datos) {
          if (!est.hijos || est.hijos.length === 0) {
            // Intentar cargar si no tiene, por si acaso es una lista lazy no inicializada
            // Aunque si el backend usa DTOs, ya deberían estar ahí si el metodo listarTodos los mapeó.
            // Revisando el backend, listarTodos llama a addLinks pero NO carga hijos explícitamente en el map
            // a menos que el repository lo haga. El backend usa mapperToER que SÍ mapea hijos.
            // Así que probablemente ya vienen.
            // Dejamos la llamada fallback por si acaso.
            est.hijos = await this.consultarHijos(est.id);
          }
        }

        this.estudiantes = datos;

        if (datos.length > 0) {
          // No mostramos éxito en carga inicial automática para no molestar,
          // pero sí si fue manual o si se quiere feedback
          // this.mostrarExito("Estudiantes cargados correctamente"); 
        } else {
          this.mostrarError("No se encontraron estudiantes en la base de datos.");
        }
        console.log("Todos:", datos);
      } catch (error) {
        console.error(error);
        this.mostrarError("Error al consultar estudiantes. Verifique la conexión con el servidor.");
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
/* Estilos para Alertas */
.alert {
  padding: 15px;
  margin-bottom: 20px;
  border: 1px solid transparent;
  border-radius: 4px;
}

.alert-success {
  color: #155724;
  background-color: #d4edda;
  border-color: #c3e6cb;
}

.alert-danger {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}

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
  border: 1px solid #ddd;
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
