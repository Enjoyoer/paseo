import type { AgentModelDefinition } from "../agent-sdk-types.js";

/** Omitted providers choose Pi's configured catalog default, never a pinned model. */
export function withPiCreateDefault(
  args: Record<string, unknown>,
  models: AgentModelDefinition[],
): Record<string, unknown> {
  if (args.provider !== undefined) return args;
  const model = models.find((row) => row.isDefault) ?? models[0];
  if (!model) throw new Error("Pi has no available default model");
  const previous =
    args.settings && typeof args.settings === "object" && !Array.isArray(args.settings)
      ? (args.settings as Record<string, unknown>)
      : {};
  const thinking =
    model.defaultThinkingOptionId ?? model.thinkingOptions?.find((row) => row.isDefault)?.id;
  return {
    ...args,
    provider: `pi/${model.id}`,
    settings: {
      ...(thinking ? { thinkingOptionId: thinking } : {}),
      ...previous,
    },
  };
}
