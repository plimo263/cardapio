import api from "./api";

const DEV_API_KEY = "b9ddb3c7-3185-4475-897a-22b4b92059a6";

export const bebidaService = {
  async list() {
    const resp = await api.get("/bebidas");
    return resp.data;
  },

  async get(id) {
    const resp = await api.get(`/bebidas/${id}`);
    return resp.data;
  },

  async create(payload) {
    const resp = await api.post(`/bebidas`, payload, {
      headers: { "X-Api-Key": DEV_API_KEY },
    });
    return resp.data;
  },

  async update(id, payload) {
    const resp = await api.put(`/bebidas/${id}`, payload, {
      headers: { "X-Api-Key": DEV_API_KEY },
    });
    return resp.data;
  },

  async remove(id) {
    const resp = await api.delete(`/bebidas/${id}`, {
      headers: { "X-Api-Key": DEV_API_KEY },
    });
    return resp.status === 204 || resp.status === 200;
  },

  async like(id) {
    const resp = await api.post(`/bebidas/${id}/like`);
    return resp.data;
  },
  async unlike(id) {
    const resp = await api.delete(`/bebidas/${id}/like`);
    return resp.data;
  },
};
