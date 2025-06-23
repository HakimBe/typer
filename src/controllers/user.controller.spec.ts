import request from "supertest";
import express from "express";
import userRoutes from "../routes/user.routes";
import authRoutes from "../routes/auth.routes";
import { User } from "../models/user.model";

const app = express();
app.use(express.json());
app.use("/users", userRoutes);
app.use("/auth", authRoutes);

describe("User API", () => {
  it("Should create a user", async () => {
    const res = await request(app)
      .post("/users")
      .send({ name: "john", email: "john@example.test", password: "1234" });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe("john");
  });

  it("Should fetch user by id", async () => {
    const user = new User({
      name: "Alice",
      email: "alice@example.test",
      password: "1234",
    });
    await user.save();

    const loginRes = await request(app).post("/auth/login").send({
      email: "alice@example.test",
      password: "1234",
    });

    expect(loginRes.status).toBe(200);

    const authToken = loginRes.body.token;

    const res = await request(app)
      .get(`/users/${user.id}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Alice");
  });

  it("Should not fetch user by id when not the same as auth", async () => {
    const user = new User({
      name: "Alice",
      email: "alice@example.test",
      password: "1234",
    });
    await user.save();

    const anotherUser = new User({
      name: "bob",
      email: "bob@example.test",
      password: "1234",
    });
    await anotherUser.save();

    const loginRes = await request(app).post("/auth/login").send({
      email: user.email,
      password: "1234",
    });

    expect(loginRes.status).toBe(200);

    const authToken = loginRes.body.token;

    const res = await request(app)
      .get(`/users/${anotherUser.id}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(403);
  });

  it("Should not fetch all the users when auth is not admin", async () => {
    await User.create({
      name: "john",
      email: "john@example.test",
      password: "1234",
    });
    await User.create({
      name: "doe",
      email: "doe@example.test",
      password: "1234",
    });

    const loginRes = await request(app).post("/auth/login").send({
      email: "john@example.test",
      password: "1234",
    });

    expect(loginRes.status).toBe(200);

    const authToken = loginRes.body.token;

    const res = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(403);
  });

  it("Should fetch all the users", async () => {
    await User.create({
      name: "john",
      email: "john@example.test",
      password: "1234",
      role: "admin",
    });
    await User.create({
      name: "doe",
      email: "doe@example.test",
      password: "1234",
    });

    const loginRes = await request(app).post("/auth/login").send({
      email: "john@example.test",
      password: "1234",
    });

    expect(loginRes.status).toBe(200);

    const authToken = loginRes.body.token;

    const res = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });

  it("Should not get all users without token", async () => {
    await User.create({
      name: "john",
      email: "john@example.test",
      password: "1234",
    });

    const res = await request(app).get("/users");

    expect(res.status).toBe(401);
  });

  it("Should not get user by id without a token", async () => {
    const user = new User({
      name: "john",
      email: "john@example.test",
      password: "1234",
    });
    await user.save();

    const res = await request(app).get(`/users/${user.id}`);

    expect(res.status).toBe(401);
  });
});
