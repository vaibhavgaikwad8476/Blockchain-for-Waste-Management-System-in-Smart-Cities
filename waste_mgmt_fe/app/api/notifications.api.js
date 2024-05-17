const { getReq } = require("./api.config");

class NotificationsApi {
  #baseUrl = "/notifications";

  getAll() {
    return getReq(`${this.#baseUrl}`);
  }
}

export const notificationsApi = new NotificationsApi();
