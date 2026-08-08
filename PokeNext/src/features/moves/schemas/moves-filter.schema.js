import { z } from "zod";

const optionalNumber = z.union([z.literal(""), z.coerce.number().nonnegative()]);

export const movesFilterSchema = z.object({
  damageClass: z.enum(["all", "physical", "special", "status"]),
  minPower: optionalNumber,
  minAccuracy: optionalNumber,
  minPP: optionalNumber,
  selectedTypeIncludes: z.array(z.string()),
  selectedWeaknessTargets: z.array(z.string()),
});
