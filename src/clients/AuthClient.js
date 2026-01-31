import axios from "axios";

const AUTH_URL = "http://localhost:8082/auth";

const obtenerToken = async (username, password) => {
    // El endpoint es /token?user=...&password=...
    const response = await axios.get(`${AUTH_URL}/token`, {
        params: {
            user: username,
            password: password
        }
    });
    return response.data;
};

// Fachada
export const loginFachada = async (username, password) => {
    return await obtenerToken(username, password);
};
