import { z } from "zod";

const labeledResourceSchema = z.object({
  code: z.string().min(1),
  label: z.string().min(1),
});

export const teamSchema = z
  .array(
    z.object({
      id: z.number().int().positive(),
      apiName: z.string().min(1),
      displayName: z.string().min(1),
      image: z.string().min(1),
      height: z.number().nonnegative(),
      weight: z.number().nonnegative(),
      types: z.array(labeledResourceSchema),
      abilities: z.array(labeledResourceSchema),
      stats: z.array(
        labeledResourceSchema.extend({
          value: z.number().nonnegative(),
        })
      ),
    })
  )
  .max(6);

export function validateTeam(team) {
  return teamSchema.safeParse(team).success;
}
