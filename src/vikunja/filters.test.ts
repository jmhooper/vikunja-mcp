import { buildFilter } from "./filters.js";

describe("buildFilter", () => {
  it("returns an empty string when given no conditions", () => {
    expect(buildFilter([])).toBe("");
  });

  it("builds a single condition", () => {
    expect(buildFilter([{ field: "done", op: "=", value: false }])).toBe(
      "?filter=done%20=%20false"
    );
  });

  it("joins multiple conditions with &&", () => {
    expect(
      buildFilter([
        { field: "done", op: "=", value: false },
        { field: "priority", op: ">=", value: 3 },
      ])
    ).toBe("?filter=done%20=%20false%20&&%20priority%20>=%203");
  });

  it("handles string values", () => {
    expect(buildFilter([{ field: "title", op: "like", value: "meeting" }])).toBe(
      "?filter=title%20like%20meeting"
    );
  });
});
