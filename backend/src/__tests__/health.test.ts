import request from "supertest";
import app from "../index.js";

// Test group for the health check endpoint
describe("GET /health", () => {
  it("should return 200 with correct structure", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", "ok");
    expect(response.body).toHaveProperty("service", "ceylonprive-api");
    expect(response.body).toHaveProperty("timestamp");
  });
});

// Test 404 for unknown routes
describe("Unknown routes", () => {
  it("should return 404 for undefined routes", async () => {
    const response = await request(app).get("/api/nonexistent");
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Route not found");
  });
});
