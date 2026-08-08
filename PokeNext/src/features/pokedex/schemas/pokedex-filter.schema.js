import { z } from "zod";

export const pokedexFilterSchema = z
  .object({
    minId: z.coerce.number().int().min(1).max(1025),
    maxId: z.coerce.number().int().min(1).max(1025),
    heightGroup: z.enum(["all", "short", "medium", "tall"]),
    weightGroup: z.enum(["all", "light", "medium", "heavy"]),
    ability: z.string().min(1),
  })
  .refine((value) => value.minId <= value.maxId, {
    message: "O número inicial não pode ser maior que o final.",
    path: ["maxId"],
  });
