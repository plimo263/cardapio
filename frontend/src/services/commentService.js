import api from "./api";

export const commentService = {
  async list(bebidaId, page = 1, per_page = 10) {
    const resp = await api.get(`/bebidas/${bebidaId}/comentarios`, {
      params: { page, per_page },
    });
    return {
      items: resp.data,
      total: Number(resp.headers["x-total-count"] || 0),
    };
  },

  async create(bebidaId, payload) {
    const resp = await api.post(`/bebidas/${bebidaId}/comentarios`, payload);
    return resp.data;
  },
  async update(comentarioId, payload) {
    const resp = await api.put(`/bebidas/comentarios/${comentarioId}`, payload);
    return resp.data;
  },
  async remove(comentarioId) {
    const resp = await api.delete(`/bebidas/comentarios/${comentarioId}`);
    return resp.status === 204;
  },
};

export default commentService;
