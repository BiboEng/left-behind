import type { World } from "../types/relic";
import { mars } from "./mars";
import { moon } from "./moon";
import type { WorldConfig } from "./types";

export const worlds: Record<World, WorldConfig> = { moon, mars };
export type { WorldConfig };
