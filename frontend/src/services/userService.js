import api from "./api";

export const userService = {
  async list() {
    const resp = await api.get("/users");
    return resp.data;
  },

  async get(id) {
    const resp = await api.get(`/users/${id}`);
    return resp.data;
  },

  async create(payload) {
    const resp = await api.post("/users", payload);
    return resp.data;
  },

  async update(id, payload) {
    const resp = await api.put(`/users/${id}`, payload);
    return resp.data;
  },

  async remove(id) {
    const resp = await api.delete(`/users/${id}`);
    return resp.status === 204;
  },
};
