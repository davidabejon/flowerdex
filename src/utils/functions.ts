import { CATS } from "../data/flowersData";

export const catOf = (tag: string) => Object.entries(CATS).find(([, c]) => c.tags.includes(tag));