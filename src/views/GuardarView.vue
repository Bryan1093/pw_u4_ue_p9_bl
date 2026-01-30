<template>
  <div class="container">
    <h2>Guardar Nuevo Estudiante</h2>

    <!-- Mensajes de Alerta -->
    <div v-if="mensajeExito" class="alert alert-success">
      {{ mensajeExito }}
    </div>
    <div v-if="mensajeError" class="alert alert-danger">
      {{ mensajeError }}
    </div>

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

      <!-- Sección de Hijos -->
      <div class="children-section">
        <h3>Hijos</h3>
        <div v-if="estudiante.hijos.length === 0" class="no-children">
          No hay hijos registrados
        </div>
        <div v-for="(hijo, index) in estudiante.hijos" :key="index" class="child-row">
          <div class="child-inputs">
            <input v-model="hijo.nombre" placeholder="Nombre del hijo" />
            <input v-model="hijo.apellido" placeholder="Apellido del hijo" />
          </div>
          <button @click="eliminarHijo(index)" class="btn-danger">X</button>
        </div>
        <button @click="agregarHijo" class="btn-info btn-sm">
          + Agregar Hijo
        </button>
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
    agregarHijo() {
      this.estudiante.hijos.push({ nombre: "", apellido: "" });
    },
    eliminarHijo(index) {
      this.estudiante.hijos.splice(index, 1);
    },
    async guardar() {
      // Validaciones básicas
      if (!this.estudiante.nombre || !this.estudiante.apellido) {
        this.mostrarError("Por favor completa los campos requeridos (Nombre y Apellido)");
        return;
      }

      if (!this.estudiante.fechaNacimiento) {
        this.mostrarError("Por favor selecciona una fecha válida.");
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
        this.mostrarExito("Estudiante guardado con éxito");
        console.log(datos);
        this.limpiarFormulario();
      } catch (error) {
        console.error(error);
        this.mostrarError("Error al guardar el estudiante. Intente nuevamente.");
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

/* Estilos para Sección de Hijos */
.children-section {
  border-top: 1px solid #ddd;
  margin-top: 20px;
  padding-top: 10px;
}

.child-row {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  align-items: center;
}

.child-inputs {
  display: flex;
  gap: 10px;
  flex: 1;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
  padding: 8px 12px;
}

.btn-danger:hover {
  background-color: #c82333;
}

.btn-sm {
  padding: 5px 10px;
  font-size: 12px;
}

.no-children {
  color: #666;
  font-style: italic;
  margin-bottom: 10px;
}
</style>
