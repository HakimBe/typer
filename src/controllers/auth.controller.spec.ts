import request from "supertest";
import express from "express";
import authRoutes from "../routes/auth.routes";
import { User } from "../models/user.model";

const app = express();
app.use(express.json());
app.use("/auth", authRoutes);

describe("Auth API", () => {
  it("Should include a body to signup", async () => {
    const res = await request(app).post("/auth/signup");

    expect(res.status).toBe(400);
  });

  it("Should include a body to login", async () => {
    const res = await request(app).post("/auth/login");

    expect(res.status).toBe(400);
  });

  it("Should singup a new user and returns a token", async () => {
    const res = await request(app).post("/auth/signup").send({
      name: "Alice",
      email: "alice@example.test",
      password: "1234",
    });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
  });

  it("Should not allow duplicate signup", async () => {
    await User.create({
      name: "Bob",
      email: "bob@example.test",
      password: "1234",
    });

    const res = await request(app).post("/auth/signup").send({
      name: "Boby",
      email: "bob@example.test",
      password: "1234",
    });

    expect(res.status).toBe(400);
  });

  it("Should login and return a token", async () => {
    await User.create({
      name: "Bob",
      email: "bob@example.test",
      password: "1234",
    });

    const res = await request(app).post("/auth/login").send({
      email: "bob@example.test",
      password: "1234",
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("Should reject login with wrong password", async () => {
    await User.create({
      name: "Bob",
      email: "bob@example.test",
      password: "1234",
    });

    const res = await request(app).post("/auth/login").send({
      email: "bob@example.test",
      password: "wrongPassword",
    });

    expect(res.status).toBe(401);
  });
});
