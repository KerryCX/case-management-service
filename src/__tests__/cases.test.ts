// supertest lets you make HTTP requests against the app without a running server
import request from "supertest";
import app from "../app";
import { caseStore } from "../store";

beforeEach(() => {
  // Resets the store before every test so no state leaks between them. Essential for reliable tests.
  caseStore.clear();
});

describe("GET /health", () => {
  it("returns status ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});

describe("GET /cases", () => {
  it("returns an empty array when no cases exist", async () => {
    // fires a real request through the full Express stack
    const res = await request(app).get("/cases");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("returns all cases", async () => {
    await request(app).post("/cases").send({ title: "Case one" });
    await request(app).post("/cases").send({ title: "Case two" });

    const res = await request(app).get("/cases");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it("filters by status", async () => {
    await request(app)
      .post("/cases")
      .send({ title: "Open case", status: "open" });
    await request(app)
      .post("/cases")
      .send({ title: "Closed case", status: "closed" });

    const res = await request(app).get("/cases?status=open");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].status).toBe("open");
  });
});

describe("POST /cases", () => {
  it("creates a case with defaults", async () => {
    const res = await request(app).post("/cases").send({ title: "New case" });
    expect(res.status).toBe(201);
    // checks that the response contains at least those fields. It doesn't fail if there are extra fields like id or createdAt
    expect(res.body).toMatchObject({
      title: "New case",
      status: "open",
      priority: "medium",
      assignee: null,
    });
    // just checks the field exists, not its exact value. Useful for things like UUIDs and timestamps that you can't predict
    expect(res.body.id).toBeDefined();
    expect(res.body.createdAt).toBeDefined();
  });

  it("returns 400 when title is invalid", async () => {
    const res = await request(app).post("/cases").send({ title: "" });
    expect(res.status).toBe(400);
    expect(res.body.message).toBeDefined();
  });

  it("returns 400 when title is missing", async () => {
    const res = await request(app).post("/cases").send({ priority: "high" });
    expect(res.status).toBe(400);
    expect(res.body.message).toBeDefined();
  });

  it("returns 400 for an invalid status", async () => {
    const res = await request(app)
      .post("/cases")
      .send({ title: "Bad status", status: "unknown" });
    expect(res.status).toBe(400);
  });

  it("returns 400 for an invalid priority", async () => {
    const res = await request(app)
      .post("/cases")
      .send({ title: "Bad priority", priority: "invalid" });
    expect(res.status).toBe(400);
  });
});

describe("GET /cases/:id", () => {
  it("returns case by :id", async () => {
    const created = await request(app)
      .post("/cases")
      .send({ title: "Case one" });
    const id = created.body.id;
    const res = await request(app).get(`/cases/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(id);
    expect(res.body.title).toBe("Case one");
  });

  it("returns 404 for a non-existent id", async () => {
    const res = await request(app).get("/cases/non-existent");
    expect(res.status).toBe(404);
    expect(res.body.message).toBeDefined();
  });
});

describe("PATCH /cases/:id", () => {
  const newTitle = "Case Two";
  it("patches case with :id", async () => {
    const created = await request(app)
      .post("/cases")
      .send({ title: "Case one" });
    const id = created.body.id;
    const patched = await request(app)
      .patch(`/cases/${id}`)
      .send({ title: newTitle });
    expect(patched.status).toBe(200);
    expect(patched.body.title).toBe(newTitle);
    expect(patched.body.status).toBe("open");
  });

  it("returns 404 for a non-existent id", async () => {
    const patched = await request(app)
      .patch("/cases/non-existent")
      .send({ title: newTitle });
    expect(patched.status).toBe(404);
    expect(patched.body.message).toBeDefined();
  });

  it("updates case :id with assignee", async () => {
    const assignee = "Kerry";
    const created = await request(app)
      .post("/cases")
      .send({ title: "Case one" });
    const id = created.body.id;
    const patched = await request(app).patch(`/cases/${id}`).send({ assignee });
    expect(patched.status).toBe(200);
    expect(patched.body.assignee).toBe(assignee);
    expect(patched.body.status).toBe("open");
  });

  it("updates case :id with null assignee", async () => {
    const created = await request(app)
      .post("/cases")
      .send({ title: "Case one" });
    const id = created.body.id;
    const patched = await request(app)
      .patch(`/cases/${id}`)
      .send({ assignee: null });
    expect(patched.status).toBe(200);
    expect(patched.body.assignee).toBeNull();
  });

  it("returns 400 for an invalid status", async () => {
    const created = await request(app)
      .post("/cases")
      .send({ title: "Case one" });
    const id = created.body.id;
    const patched = await request(app)
      .patch(`/cases/${id}`)
      .send({ status: "banana" });
    expect(patched.status).toBe(400);
    expect(patched.body.message).toBeDefined();
  });

  it("returns 400 for an empty status", async () => {
    const created = await request(app)
      .post("/cases")
      .send({ title: "Case one" });
    const id = created.body.id;
    const patched = await request(app)
      .patch(`/cases/${id}`)
      .send({ status: "" });
    expect(patched.status).toBe(400);
    expect(patched.body.message).toBeDefined();
  });

  it("returns 400 for an empty title", async () => {
    const created = await request(app)
      .post("/cases")
      .send({ title: "Case one" });
    const id = created.body.id;
    const patched = await request(app)
      .patch(`/cases/${id}`)
      .send({ title: "" });
    expect(patched.status).toBe(400);
    expect(patched.body.message).toBeDefined();
  });

  it("returns 400 for an invalid priority", async () => {
    const created = await request(app)
      .post("/cases")
      .send({ title: "Case one" });
    const id = created.body.id;
    const patched = await request(app)
      .patch(`/cases/${id}`)
      .send({ priority: "banana" });
    expect(patched.status).toBe(400);
    expect(patched.body.message).toBeDefined();
  });

  it("returns 400 for an empty priority", async () => {
    const created = await request(app)
      .post("/cases")
      .send({ title: "Case one" });
    const id = created.body.id;
    const patched = await request(app)
      .patch(`/cases/${id}`)
      .send({ priority: "" });
    expect(patched.status).toBe(400);
    expect(patched.body.message).toBeDefined();
  });
});

describe("DELETE /cases/:id", () => {
  it("deletes case with :id", async () => {
    const created = await request(app)
      .post("/cases")
      .send({ title: "Case one" });
    const id = created.body.id;
    const deleted = await request(app).delete(`/cases/${id}`);
    expect(deleted.status).toBe(204);
    const res = await request(app).get(`/cases/${id}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toBeDefined();
  });
  it("returns 404 for a non-existent id", async () => {
    const res = await request(app).delete("/cases/non-existent");
    expect(res.status).toBe(404);
    expect(res.body.message).toBeDefined();
  });
});
