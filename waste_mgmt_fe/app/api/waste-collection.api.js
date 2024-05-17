const { postReq, getReq, putReq } = require("./api.config");

class WasteCollectionApi {
  #baseUrl = "/waste-collections";

  getAllWasteCollections(params) {
    return getReq(`${this.#baseUrl}`, { params: params });
  }

  createWasteCollection(payload) {
    return postReq(`${this.#baseUrl}`, payload);
  }

  updateWasteCollection(wasteCollectionId, payload) {
    return putReq(`${this.#baseUrl}/${wasteCollectionId}`, payload);
  }

  getWasteCollectionCountAnalysis() {
    return getReq(`${this.#baseUrl}/analysis/count`);
  }

  getWasteTypeWiseDistribution() {
    return getReq(`${this.#baseUrl}/analysis/waste-types`);
  }
}

export const wasteCollectionApi = new WasteCollectionApi();
