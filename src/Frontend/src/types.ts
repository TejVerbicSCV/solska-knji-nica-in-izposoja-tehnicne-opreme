export type UserRole = 'student' | 'knjiznicar';

export interface User {
  id: string;
  email: string;
  ime: string;
  priimek: string;
  vloga: UserRole;
}

export interface LibraryItem {
  id: number;
  ime?: string;
  naslov?: string;
  isbn?: string;
  leto?: number;
  stevilo: number;
  slika_url?: string;
  opis?: string;
  serijska_st?: string;
  tip: 'knjiga' | 'oprema';
}
