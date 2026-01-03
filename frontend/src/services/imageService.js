import api from "./api";

const DEV_API_KEY = "b9ddb3c7-3185-4475-897a-22b4b92059a6";

export const imageService = {
  async list() {
    const resp = await api.get("/images");
    return resp.data;
  },

  async upload(file, onUploadProgress = undefined) {
    const fd = new FormData();
    fd.append("file", file);
    const resp = await api.post("/images", fd, {
      headers: {
        "X-Api-Key": DEV_API_KEY,
      },
      // Ensure axios does not send the default application/json Content-Type
      // so the browser can set the correct multipart/form-data boundary.
      transformRequest: [
        (data, headers) => {
          try {
            delete headers["Content-Type"];
          } catch (e) {}
          return data;
        },
      ],
      onUploadProgress,
    });
    return resp.data;
  },

  async remove(id) {
    const resp = await api.delete(`/images/${id}`, {
      headers: { "X-Api-Key": DEV_API_KEY },
    });
    return resp.status === 204 || resp.status === 200;
  },
};
