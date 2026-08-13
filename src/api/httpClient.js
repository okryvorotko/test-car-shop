export class HttpClient {
  constructor({ baseUrl }) {
    this.baseUrl = baseUrl.replace(/\/+$/, "");
  }

  async request(method, path, { token, body, query } = {}) {
    const url = new URL(`${this.baseUrl}${path}`);

    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== null && value !== "") {
          url.searchParams.set(key, String(value));
        }
      }
    }

    const headers = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    if (body !== undefined) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body)
    });
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    return {
      status: response.status,
      ok: response.ok,
      data,
      headers: response.headers
    };
  }

  get(path, options) {
    return this.request("GET", path, options);
  }

  post(path, options) {
    return this.request("POST", path, options);
  }
}
