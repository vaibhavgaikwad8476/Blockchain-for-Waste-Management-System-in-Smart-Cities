const { getReq } = require("./api.config");

class UsersApi {
  #baseUrl = "/users";

  getAll() {
    return getReq(`${this.#baseUrl}`);
  }
}

export const userApi = new UsersApi();
