import api from "./api";

// Dev convenience: use backend .env API_KEY for write operations when no token is available.
// WARNING: do NOT use a hardcoded API key in production.
const DEV_API_KEY = "b9ddb3c7-3185-4475-897a-22b4b92059a6";

export const categoriaService = {
  async list() {
    const resp = await api.get("/categorias");
    return resp.data;
  },

  async get(id) {
    const resp = await api.get(`/categorias/${id}`);
    return resp.data;
  },

  async create(payload) {
    const resp = await api.post(`/categorias`, payload, {
      headers: { "X-Api-Key": DEV_API_KEY },
    });
    return resp.data;
  },

  async update(id, payload) {
    const resp = await api.put(`/categorias/${id}`, payload, {
      headers: { "X-Api-Key": DEV_API_KEY },
    });
    return resp.data;
  },

  async remove(id) {
    const resp = await api.delete(`/categorias/${id}`, {
      headers: { "X-Api-Key": DEV_API_KEY },
    });
    return resp.status === 204 || resp.status === 200;
  },
};
