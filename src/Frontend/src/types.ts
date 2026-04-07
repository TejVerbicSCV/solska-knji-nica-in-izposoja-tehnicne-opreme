export type UserRole = 'student' | 'knjiznicar';

export interface User {
  id: string;
  email: string;
  ime: string;
  priimek: string;
  vloga: UserRole;
}

export interface LibraryItem {
  id: string;
  naziv: string;
  opis: string;
  kategorija: string;
  inventarnaStevilka: string;
  lokacija: string;
  status: 'na_voljo' | 'izposojeno' | 'rezervirano' | 'v_popravilu';
  slikaUrl?: string;
}
