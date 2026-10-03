import { describe, expect, test } from "vitest";
import { withPiCreateDefault } from "./pi-create-default.js";

describe("omitted provider Pi defaults", () => {
  const models = [
    {
      id: "route/default-example",
      label: "Luna",
      isDefault: true,
      defaultThinkingOptionId: "xhigh",
    },
    { id: "route/other", label: "Astra" },
  ];
  test("takes model and thinking verbatim from catalog", () => {
    expect(withPiCreateDefault({ title: "task" }, models)).toEqual({
      title: "task",
      provider: "pi/route/default-example",
      settings: { thinkingOptionId: "xhigh" },
    });
  });
  test("preserves explicit routes without requiring Pi availability", () => {
    const args = {
      provider: "codex/example",
      settings: { thinkingOptionId: "low", features: { fast_mode: true } },
    };
    expect(withPiCreateDefault(args, [])).toBe(args);
  });
  test("preserves explicit thinking on an omitted provider", () => {
    expect(
      withPiCreateDefault({ settings: { thinkingOptionId: "medium" } }, models).settings,
    ).toEqual({ thinkingOptionId: "medium" });
  });
  test("fails when Pi has no model instead of falling back", () => {
    expect(() => withPiCreateDefault({}, [])).toThrow("Pi has no available default model");
  });
});
