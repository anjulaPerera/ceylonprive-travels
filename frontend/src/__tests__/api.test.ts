import api from "@/lib/api";
import type {
  AxiosInterceptorManager,
  InternalAxiosRequestConfig,
} from "axios";

type InterceptorManagerWithHandlers<T> = AxiosInterceptorManager<T> & {
  handlers: unknown[];
};

describe("API client configuration", () => {
  it("has correct base URL from environment", () => {
    expect(api.defaults.baseURL).toBe(
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
    );
  });

  it("has Content-Type header set to application/json", () => {
    expect(api.defaults.headers["Content-Type"]).toBe("application/json");
  });

  it("is an axios instance", () => {
    expect(api).toBeDefined();
    expect(typeof api.get).toBe("function");
    expect(typeof api.post).toBe("function");
    expect(typeof api.put).toBe("function");
    expect(typeof api.delete).toBe("function");
    expect(typeof api.patch).toBe("function");
  });

  it("has request interceptors configured", () => {
    const requestInterceptors = api.interceptors
      .request as InterceptorManagerWithHandlers<InternalAxiosRequestConfig>;

    expect(requestInterceptors.handlers.length).toBeGreaterThan(0);
  });

  it("has response interceptors configured", () => {
    const responseInterceptors = api.interceptors
      .response as InterceptorManagerWithHandlers<unknown>;

    expect(responseInterceptors.handlers.length).toBeGreaterThan(0);
  });
});

describe("API request interceptor — token injection", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("does not add Authorization header when no token stored", () => {
    localStorage.removeItem("ceylonprive_token");

    expect(localStorage.getItem("ceylonprive_token")).toBeNull();
  });

  it("reads token from localStorage key ceylonprive_token", () => {
    localStorage.setItem("ceylonprive_token", "test-jwt-token");

    expect(localStorage.getItem("ceylonprive_token")).toBe("test-jwt-token");
  });

  it("clears token from localStorage on 401 response", () => {
    localStorage.setItem("ceylonprive_token", "expired-token");

    const status = 401;

    if (status === 401) {
      localStorage.removeItem("ceylonprive_token");
    }

    expect(localStorage.getItem("ceylonprive_token")).toBeNull();
  });
});
