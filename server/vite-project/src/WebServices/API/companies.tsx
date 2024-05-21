import { z } from "zod";

export type Compagny = {
    id: string;
    name: string;
    domains: Array<string>;
  };

  const COMPAGNY_SCHEMA = z.object({
    id: z.string(),
    name: z.string(),
    domains: z.array(z.string()),
  });
  
  
export async function getCompagnies(): Promise<Compagny[] | null> {
    try {
      const response = await fetch("http://localhost:3000/companies");
      if (!response.ok) {
        throw new Error('Erreur avec le reseau');
      }
      const json = await response.json();
      const compagnies = json.map((item: any) => CompagnyFromJSON(item));
      return compagnies;
    } catch (error) {
      console.error("Erreur lors de la récuperation des compagnies:", error);
      return null;
    }
  }

  export async function getCompagny(id:string): Promise<Compagny | null> {
    try {
      const response = await fetch(`http://localhost:3000/companies/${id}`);
      if (!response.ok) {
        throw new Error('Erreur avec le reseau');
      }
      const json = await response.json();
      const compagny = json.map((item: any) => CompagnyFromJSON(item));
      return compagny;
    } catch (error) {
      console.error("Erreur lors de la récuperation des compagnies:", error);
      return null;
    }
  }
  
  function CompagnyFromJSON(json: any): Compagny | null {
    const parsed = COMPAGNY_SCHEMA.safeParse(json);
    if (parsed.success) {
      return parsed.data; // Zod will ensure that data is of type Compagny
    } else {
      console.error(parsed.error);
      return null;
    }
  }