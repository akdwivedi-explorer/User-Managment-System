import request from "supertest";
import mongoose from "mongoose";
import app from "../index.js";
import User from "../src/model/User.js";
import dotenv from "dotenv";

dotenv.config();

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/user-management"
    );
  }
});

afterAll(async () => {
  await User.deleteMany({ email: "test_user_unit@example.com" });
  await mongoose.connection.close();
});

describe("Authentication API Tests", () => {
  const userData = {
    fullName: "Unit Test User",
    email: "test_user_unit@example.com",
    password: "Password@123",
    confirm: "Password@123",
  };

  let token = "";

  it("POST /api/auth/signup - Should register a new user", async () => {
    const res = await request(app).post("/api/auth/signup").send(userData);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("email", userData.email);
  });

  it("POST /api/auth/signup - Should fail if email already exists", async () => {
    const res = await request(app).post("/api/auth/signup").send(userData);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("message");
  });

  it("POST /api/auth/login - Should login successfully", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: userData.email,
      password: userData.password,
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  it("POST /api/auth/login - Should reject wrong password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: userData.email,
      password: "WrongPassword",
    });

    expect(res.statusCode).toEqual(400);
  });

  it("GET /api/users/profile - Should allow access with valid token", async () => {
    const res = await request(app)
      .get("/api/users/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("email", userData.email);
  });

  it("GET /api/users/profile - Should reject access without token", async () => {
    const res = await request(app).get("/api/users/profile");

    expect(res.statusCode).toEqual(401);
  });
});
