// Shared types and data for the Flower app
export interface Flower {
  id: number;
  name: string;
  latin: string;
  e: string; // legacy emoji fallback
  images: string[]; // image URLs for slider
  desc: string;
  tags: string[];
}
