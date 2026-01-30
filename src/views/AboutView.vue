<template>
  <div>
    <AboutComponents />
  </div>
</template>

<script>
import AboutComponents from '@/components/AboutComponents.vue';
import consultarTodos from '@/components/consultarTodos.vue';
import consultarID from '@/components/consultarID.vue';
import guardar from '@/components/guardar.vue';
import actualizar from '@/components/actualizar.vue';
import eliminar from '@/components/eliminar.vue';
export default {
  components: {
    AboutComponents,
    consultarTodos,
    consultarID,
    guardar,
    actualizar,
    eliminar
  }
}
</script>

<style></style>