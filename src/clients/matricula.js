import axios from "axios";

const API_URL = "http://localhost:8081/matricula/api/v1.0/estudiantes";

// ======================
// MÉTODOS INTERNOS
// ======================

const consultarTodos = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const consultarPorID = async (id) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const guardar = async (body) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(API_URL, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const actualizar = async (id, body) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(`${API_URL}/${id}`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const actualizarParcial = async (id, body) => {
  const token = localStorage.getItem("token");
  const response = await axios.patch(`${API_URL}/${id}`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const eliminar = async (id) => {
  const token = localStorage.getItem("token");
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// ======================
// FACHADAS (EXPORTS)
// ======================

export const consultarTodosFachada = async () => {
  return await consultarTodos();
};

export const consultarPorIDFachada = async (id) => {
  return await consultarPorID(id);
};

export const guardarFachada = async (body) => {
  return await guardar(body);
};

export const actualizarFachada = async (id, body) => {
  return await actualizar(id, body);
};

export const actualizarParcialFachada = async (id, body) => {
  return await actualizarParcial(id, body);
};

export const eliminarFachada = async (id) => {
  return await eliminar(id);
};
