export interface Phones {
  number: string;
}

export interface Contact {
  created_at: string;
  first_name: string;
  id: number;
  last_name: string;
  phones: Phones[];
}

export interface Number {
  number?: string | undefined;
  zone?: string | undefined;
}

export type Inputs = {
  first_name?: string | undefined;
  last_name?: string | undefined;
  phones?: Number[];
};
