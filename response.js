module.exports = class AppRes {
  constructor(request) {}

  /**
   * Send Response with data, headers and status code
   * @param {any} data data sent by user
   * @param {Object} headers headers object sent by user, default {'content-type': 'application/json'}
   * @param {boolean} status status for the response, default 200
   * @returns
   */
  send(data, headers = { "content-type": "application/json" }, status = 200) {
    return new Response(JSON.stringify(data), {
      status,
      headers,
    });
  }
};
