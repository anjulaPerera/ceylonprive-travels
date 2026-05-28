import request from "supertest";
import app from "../index.js";

const validContact = {
  firstName: "Test",
  lastName: "User",
  email: "test@example.com",
  phone: "+1234567890",
  country: "United Kingdom",
  tripType: "honeymoon",
  groupSize: 2,
  duration: 7,
  interests: ["beaches", "temples"],
  message: "This is a test contact submission for automated testing.",
};

describe("POST /api/contact", () => {
  it("should accept a valid contact submission", async () => {
    const response = await request(app).post("/api/contact").send(validContact);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("id");
  });

  it("should reject submission with missing required fields", async () => {
    const response = await request(app)
      .post("/api/contact")
      .send({ firstName: "Only" }); // Missing required fields

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Validation failed");
  });

  it("should reject invalid email format", async () => {
    const response = await request(app)
      .post("/api/contact")
      .send({ ...validContact, email: "not-an-email" });

    expect(response.status).toBe(400);
  });

  it("should accept submission with AI plan attached", async () => {
    const response = await request(app)
      .post("/api/contact")
      .send({
        ...validContact,
        email: "aitest@example.com",
        aiGeneratedPlan: {
          title: "Test Itinerary",
          summary: "A test plan",
          duration: 7,
          highlights: ["Beach", "Temple"],
          days: [],
          bestTimeToVisit: "December to March",
        },
      });

    expect(response.status).toBe(201);
  });
});

describe("GET /api/contact (protected)", () => {
  it("should reject unauthenticated request", async () => {
    const response = await request(app).get("/api/contact");
    expect(response.status).toBe(401);
  });

  it("should return submissions when authenticated", async () => {
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: "admin@ceylonprive.com",
      password: "Admin@CeylonPrive2025!",
    });

    const token = loginResponse.body.token;

    const response = await request(app)
      .get("/api/contact")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("submissions");
    expect(Array.isArray(response.body.submissions)).toBe(true);
  });
});
