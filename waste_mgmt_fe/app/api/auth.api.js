const { postReq } = require("./api.config");

class AuthApi {
  #baseUrl = "/auth";

  signup(payload) {
    return postReq(`${this.#baseUrl}/signup`, payload);
  }

  login(payload) {
    return postReq(`${this.#baseUrl}/login`, payload);
  }
}

export const authApi = new AuthApi();
