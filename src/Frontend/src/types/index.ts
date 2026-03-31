export type ItemCategory = 'knjiga' | 'prenosnik' | 'kamera' | 'oprema';
export type ItemStatus = 'na_voljo' | 'izposojeno' | 'rezervirano' | 'v_popravilu';
export type UserRole = 'student' | 'knjiznicar';
export type ReservationStatus = 'aktivna' | 'potrjena' | 'zavrnjena' | 'zakljucena';
export type LoanStatus = 'aktivna' | 'vrnjena' | 'zamuda';

export interface LibraryItem {
  id: string;
  naziv: string;
  kategorija: ItemCategory;
  opis: string;
  status: ItemStatus;
  inventarnaStevilka: string;
  lokacija: string;
  slika?: string;
}

export interface User {
  id: string;
  email: string;
  ime: string;
  priimek: string;
  vloga: UserRole;
}

export interface Reservation {
  id: string;
  predmetId: string;
  studentIme: string;
  studentEmail: string;
  datumRezervacije: string;
  datumOd: string;
  datumDo: string;
  status: ReservationStatus;
  predmetNaziv?: string;
}

export interface Loan {
  id: string;
  predmetId: string;
  studentIme: string;
  studentEmail: string;
  datumIzposoje: string;
  rokoVrnitve: string;
  datumVrnitve?: string;
  status: LoanStatus;
  opombe?: string;
  poskodbe?: string;
  slikaPoskodbe?: string;
  predmetNaziv?: string;
}
