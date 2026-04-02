import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = __DEV__
  ? "http://localhost:3000"
  : "https://ennie-api.up.railway.app";

class ApiService {
  /* ── Token management ── */
  async getToken() {
    return AsyncStorage.getItem("token");
  }

  async setToken(token) {
    return AsyncStorage.setItem("token", token);
  }

  async clearToken() {
    return AsyncStorage.removeItem("token");
  }

  /* ── Generic request ── */
  async request(path, options = {}) {
    const token = await this.getToken();
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const data = await res.json();
    if (!res.ok) throw { status: res.status, ...data };
    return data;
  }

  /* ── Auth ── */
  signup(email, password, role, dob) {
    return this.request("/auth/signup", {
      method: "POST",
      body: { email, password, role, dob },
    });
  }

  login(email, password) {
    return this.request("/auth/login", {
      method: "POST",
      body: { email, password },
    });
  }

  getMe() {
    return this.request("/auth/me");
  }

  /* ── Sessions ── */
  createSession(tier, baselinePins, condition) {
    return this.request("/sessions", {
      method: "POST",
      body: { tier, baselinePins, condition },
    });
  }

  getSession(id) {
    return this.request(`/sessions/${id}`);
  }

  updateSession(id, data) {
    return this.request(`/sessions/${id}`, { method: "PATCH", body: data });
  }

  endSession(id, finalPins) {
    return this.request(`/sessions/${id}/end`, {
      method: "POST",
      body: { finalPins },
    });
  }

  getSessionHistory() {
    return this.request("/sessions/history/me");
  }

  /* ── Queue ── */
  getQueueStatus() {
    return this.request("/queue/status");
  }

  joinQueue(tier, condition) {
    return this.request("/queue/join", {
      method: "POST",
      body: { tier, condition },
    });
  }

  leaveQueue() {
    return this.request("/queue/leave", { method: "DELETE" });
  }

  /* ── Healers ── */
  onboardHealer(data) {
    return this.request("/healers/onboard", { method: "POST", body: data });
  }

  getHealerProfile() {
    return this.request("/healers/profile");
  }

  updateAvailability(data) {
    return this.request("/healers/availability", {
      method: "PATCH",
      body: data,
    });
  }

  getSpecializations() {
    return this.request("/healers/specializations");
  }

  claimPatient() {
    return this.request("/healers/claim", { method: "POST" });
  }

  getEarnings() {
    return this.request("/healers/earnings");
  }

  /* ── Groups ── */
  getGroups() {
    return this.request("/groups");
  }

  joinGroup(id) {
    return this.request(`/groups/${id}/join`, { method: "POST" });
  }

  /* ── Payments ── */
  createPaymentIntent(tier, sessionId) {
    return this.request("/payments/create-intent", {
      method: "POST",
      body: { tier, sessionId },
    });
  }

  confirmPayment(paymentIntentId) {
    return this.request("/payments/confirm", {
      method: "POST",
      body: { paymentIntentId },
    });
  }

  /* ── Referrals ── */
  generateReferral() {
    return this.request("/referrals/generate", { method: "POST" });
  }

  getReferralStats() {
    return this.request("/referrals/stats");
  }
}

export default new ApiService();
