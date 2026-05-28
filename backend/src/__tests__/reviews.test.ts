import request from "supertest";
import app from "../index.js";

describe("GET /api/reviews (public)", () => {
  it("should return published reviews array", async () => {
    const response = await request(app).get("/api/reviews");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("reviews");
    expect(Array.isArray(response.body.reviews)).toBe(true);
  });
});

describe("GET /api/reviews/all (protected)", () => {
  it("should reject unauthenticated request", async () => {
    const response = await request(app).get("/api/reviews/all");
    expect(response.status).toBe(401);
  });
});

describe("Token and Review flow", () => {
  let authToken: string;
  let reviewToken: string;

  // Login once before all tests in this group
  beforeAll(async () => {
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: "admin@ceylonprive.com",
      password: "Admin@CeylonPrive2025!",
    });
    authToken = loginResponse.body.token;
  });

  it("should generate a review token", async () => {
    const response = await request(app)
      .post("/api/tokens/generate")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ customerName: "Jest Test Customer", expiryDays: 7 });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("reviewUrl");
    reviewToken = response.body.token;
  });

  it("should verify the generated token as valid", async () => {
    const response = await request(app).get(
      `/api/tokens/verify/${reviewToken}`,
    );

    expect(response.status).toBe(200);
    expect(response.body.valid).toBe(true);
  });

  it("should allow submitting a review with a valid token", async () => {
    const response = await request(app).post("/api/reviews").send({
      token: reviewToken,
      customerName: "Jest Test Customer",
      customerEmail: "jest@test.com",
      rating: 5,
      title: "Automated test review",
      body: "This review was submitted by the automated Jest test suite.",
      tourDate: "2025-01-15",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message");
  });

  it("should reject reusing the same token", async () => {
    const response = await request(app).post("/api/reviews").send({
      token: reviewToken,
      customerName: "Jest Test Customer",
      customerEmail: "jest@test.com",
      rating: 4,
      body: "Trying to reuse the token.",
    });

    // Token is used — should be rejected
    expect(response.status).toBe(400);
  });

  it("should reject submitting a review with an invalid token", async () => {
    const response = await request(app).post("/api/reviews").send({
      token: "completely-invalid-token-that-does-not-exist",
      customerName: "Hacker",
      customerEmail: "hack@test.com",
      rating: 1,
      body: "Trying with a fake token.",
    });

    expect(response.status).toBe(400);
  });
});
