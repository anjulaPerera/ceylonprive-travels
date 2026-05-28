import request from "supertest";
import app from "../index.js";

describe("POST /api/auth/login", () => {
  // This test requires the seed to have run (admin user must exist)
  it("should login with valid credentials and return a token", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "admin@ceylonprive.com",
      password: "Admin@CeylonPrive2025!",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("user");
    expect(response.body.user.email).toBe("admin@ceylonprive.com");
    expect(response.body.user).not.toHaveProperty("passwordHash");
  });

  it("should reject invalid credentials with 401", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "admin@ceylonprive.com",
      password: "wrongpassword",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
  });

  it("should reject missing fields with 400", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@ceylonprive.com" }); // Missing password

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Validation failed");
  });

  it("should reject invalid email format with 400", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "not-an-email", password: "somepassword" });

    expect(response.status).toBe(400);
  });
});

describe("GET /api/auth/me", () => {
  it("should reject request with no token", async () => {
    const response = await request(app).get("/api/auth/me");
    expect(response.status).toBe(401);
  });

  it("should reject request with invalid token", async () => {
    const response = await request(app)
      .get("/api/auth/me")
      .set("Authorization", "Bearer invalid.token.here");
    expect(response.status).toBe(401);
  });

  it("should return user data with valid token", async () => {
    // First login to get a real token
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: "admin@ceylonprive.com",
      password: "Admin@CeylonPrive2025!",
    });

    const token = loginResponse.body.token;

    const response = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.user.email).toBe("admin@ceylonprive.com");
  });
});
