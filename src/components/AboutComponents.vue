<template>
  <div class="container">
    <h2>Estudiantes</h2>

    <div class="section">
      <button @click="consultarTodos">Consultar Todos</button>
    </div>

    <div class="section">
      <input v-model.number="id" type="number" placeholder="ID" />
      <button @click="consultarPorID">Consultar por ID</button>
    </div>

    <div class="section">
      <input v-model="estudiante.nombre" placeholder="Nombre" />
      <input v-model="estudiante.apellido" placeholder="Apellido" />
      <input
        v-model="estudiante.fechaNacimiento"
        type="datetime-local"
        placeholder="Fecha Nacimiento"
      />
      <input v-model="estudiante.provincia" placeholder="Provincia" />
      <select v-model="estudiante.genero">
        <option disabled value="">Seleccione género</option>
        <option value="M">Masculino</option>
        <option value="F">Femenino</option>
        <option value="No-binario">No-binario</option>
        <option value="pansexual">Pansexual</option>
      </select>
    </div>

    <div class="section">
      <button @click="guardar">Guardar</button>
      <button @click="actualizar">Actualizar</button>
      <button @click="actualizarParcial">Actualizar Parcial</button>
      <!-- nuevo botón -->
      <button @click="eliminar">Eliminar</button>
    </div>

    <h3>Listado de Estudiantes</h3>
    <table border="1" cellspacing="0" cellpadding="5">
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
        <tr
          v-for="e in estudiantes"
          :key="e.id"
          @click="cargarEstudianteEnInputs(e)"
          style="cursor: pointer"
        >
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
  </div>
</template>

<script>
import {
  consultarTodosFachada,
  consultarPorIDFachada,
  guardarFachada,
  actualizarFachada,
  actualizarParcialFachada,
  eliminarFachada,
} from "@/clients/matricula.js";

export default {
  name: "AboutComponents",
  data() {
    return {
      id: null,
      estudiante: {
        nombre: "",
        apellido: "",
        fechaNacimiento: "",
        provincia: "",
        genero: "",
        hijos: [],
      },
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
      }
    },

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
        this.estudiantes = [datos]; // opcional: mostrar solo este en la tabla
        this.cargarEstudianteEnInputs(datos);
        console.log("Por ID:", datos);
      } catch (error) {
        console.error(error);
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

    cargarEstudianteEnInputs(est) {
      this.id = est.id;
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
      this.estudiante.hijos = est.hijos || [];
    },

    async guardar() {
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

      const datos = await guardarFachada(body);
      console.log(datos);
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
          ...this.estudiante,
          fechaNacimiento: fecha,
        };
        const datos = await actualizarFachada(this.id, body);
        console.info("Estudiante actualizado con éxito");
        this.consultarTodos();
      } catch (error) {
        console.error(error);
      }
    },

    async actualizarParcial() {
      if (!this.id) {
        console.warn(
          "Por favor selecciona un estudiante para actualizar parcialmente",
        );
        return;
      }
      try {
        let fecha = this.estudiante.fechaNacimiento;
        if (fecha && fecha.length === 16) {
          fecha += ":00";
        }
        const body = {
          ...this.estudiante,
          fechaNacimiento: fecha,
        };
        // Aquí llamas a un endpoint PATCH en tu fachada, que debes tener
        const datos = await actualizarParcialFachada(this.id, body);
        console.info("Estudiante actualizado parcialmente con éxito");
        this.consultarTodos();
      } catch (error) {
        console.error(error);
      }
    },

    async eliminar() {
      if (!this.id) {
        console.warn("Por favor selecciona un estudiante para eliminar");
        return;
      }
      try {
        await eliminarFachada(this.id);
        console.info("Estudiante eliminado con éxito");
        this.limpiarFormulario();
        this.consultarTodos();
      } catch (error) {
        console.error(error);
      }
    },

    limpiarFormulario() {
      this.id = null;
      this.estudiante = {
        nombre: "",
        apellido: "",
        fechaNacimiento: "",
        provincia: "",
        genero: "",
        hijos: [],
      };
    },

    formatFecha(fecha) {
      if (!fecha) return "N/A";
      // Mostrar solo fecha y hora sin segundos
      return fecha.substring(0, 16).replace("T", " ");
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: auto;
}

.section {
  margin-bottom: 15px;
}

input,
select {
  display: block;
  margin-bottom: 5px;
  width: 100%;
  padding: 5px;
  box-sizing: border-box;
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

tr:hover {
  background-color: #f0f0f0;
  cursor: pointer;
}
</style>
