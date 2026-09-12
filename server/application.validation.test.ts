import { describe, expect, it } from "vitest";
import { applicationSchema } from "./routers.js";

const validApplication = {
  fullName: "Aarav Sharma",
  collegeEmail: "aarav@nith.ac.in",
  personalEmail: "aarav@example.com",
  phone: "+91 9876543210",
  rollNumber: "22CSE001",
  branch: "Computer Science and Engineering",
  year: "3rd",
  primaryDomain: "Web Application Security",
  secondaryDomain: "Cryptography",
  skills: "TypeScript, HTTP, Linux",
  experience: "Built a small security lab.",
  links: "https://github.com/example",
  motivation: "I want to learn responsibly and contribute to a stronger campus security community.",
  consent: true,
};

describe("applicationSchema", () => {
  it("accepts a complete participant application", () => {
    expect(applicationSchema.safeParse(validApplication).success).toBe(true);
  });

  it("rejects an application without consent", () => {
    expect(applicationSchema.safeParse({ ...validApplication, consent: false }).success).toBe(false);
  });

  it("rejects an invalid college email", () => {
    expect(applicationSchema.safeParse({ ...validApplication, collegeEmail: "not-an-email" }).success).toBe(false);
  });
});
