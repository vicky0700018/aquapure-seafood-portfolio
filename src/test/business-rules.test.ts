import { describe, expect, it } from "vitest";
import { DEMO_PASS, DEMO_USER } from "@/lib/store";
import { validateEnquiry } from "@/components/site";
import { filterEnquiries } from "@/components/admin";
import type { Enquiry } from "@/lib/defaults";

const good = { name: "Ravi", company: "", email: "ravi@example.com", phone: "+91 98765 43210", country: "India", product: "", quantity: "", type: "Bulk Supply", message: "Need 500 kg prawns" };

describe("demo admin credentials", () => {
  it("are admin / AquaPure@123", () => {
    expect(DEMO_USER).toBe("admin");
    expect(DEMO_PASS).toBe("AquaPure@123");
  });
});

describe("enquiry validation", () => {
  it("accepts a complete enquiry", () => {
    expect(validateEnquiry(good)).toEqual({});
  });
  it("requires name, email, phone, country and message", () => {
    const e = validateEnquiry({ ...good, name: "", email: "", phone: "", country: "", message: "" });
    expect(Object.keys(e).sort()).toEqual(["country", "email", "message", "name", "phone"]);
  });
  it("rejects a badly formatted email", () => {
    expect(validateEnquiry({ ...good, email: "ravi@example" }).email).toBeDefined();
  });
  it("rejects phone numbers with letters or fewer than 7 digits", () => {
    expect(validateEnquiry({ ...good, phone: "12345" }).phone).toBeDefined();
    expect(validateEnquiry({ ...good, phone: "98abc76543" }).phone).toBeDefined();
  });
});

describe("enquiry search and filters", () => {
  const base: Enquiry = { ...good, id: "1", date: "2026-01-01", status: "New" };
  const list: Enquiry[] = [
    base,
    { ...base, id: "2", name: "Meera", email: "meera@fish.in", type: "Product Enquiry", status: "Closed" },
  ];
  it("filters by enquiry type", () => {
    expect(filterEnquiries(list, "", "Product Enquiry", "All").map((e) => e.id)).toEqual(["2"]);
  });
  it("filters by status", () => {
    expect(filterEnquiries(list, "", "All", "New").map((e) => e.id)).toEqual(["1"]);
  });
  it("searches by name or email", () => {
    expect(filterEnquiries(list, "meera@", "All", "All").map((e) => e.id)).toEqual(["2"]);
  });
});
