const { postReq, getReq } = require("./api.config");

class WasteTypesApi {
  #baseUrl = "/waste-types";

  getAllWasteTypes() {
    return getReq(`${this.#baseUrl}`);
  }
}

export const wasteTypesApi = new WasteTypesApi();
