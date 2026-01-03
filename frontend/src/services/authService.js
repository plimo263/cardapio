import api from "./api";

export const authService = {
  async login(username, password) {
    try {
      console.log("🔐 Tentando fazer login com:", username);
      const response = await api.post("/auth/login", {
        username,
        password,
      });
      console.log("✅ Resposta do login:", response.data);
      const { token } = response.data;
      localStorage.setItem("authToken", token);
      return { success: true, token };
    } catch (error) {
      console.error("❌ Erro no login:", error);
      console.error("❌ Detalhes do erro:", error.response?.data);
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao fazer login",
      };
    }
  },

  async logout() {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      localStorage.removeItem("authToken");
    }
  },

  isAuthenticated() {
    return !!localStorage.getItem("authToken");
  },

  getToken() {
    return localStorage.getItem("authToken");
  },
};
