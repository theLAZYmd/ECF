export declare type Membership = 'BRONZE' | 'SILVER' | 'GOLD' | 'DIAMOND';
export interface TableRow {
    [key: string]: string | null;
}
export declare type Table = TableRow[];
export interface RawSearchProfile extends TableRow {
    Ref: string;
    Sex: 'M' | 'F';
    Age: string | null;
    Club: string;
    Member: Membership;
    Name: string;
    Standard: string | null;
    Standard_1: string | null;
    Previous: string | null;
    Previous_1: string | null;
    Rapidplay: string | null;
    Rapidplay_1: string | null;
    Previous_2: string | null;
    Previous_3: string | null;
}
export interface BaseProfile {
    id: string;
    member: Membership;
    name: string;
    lastName: string;
    firstName: string;
    middleName: string;
    age?: number;
}
interface SearchProfileRating {
    rating: number | null;
    category: string | null;
    previousRating: number | null;
    previousCategory: string | null;
}
export interface SearchProfile extends BaseProfile {
    club?: string;
    standard: SearchProfileRating;
    rapidplay: SearchProfileRating;
}
export interface ProfileRating {
    category: string | null;
    rating: number | null;
    unamendedRating: number | null;
    played: number | null;
    playedLastYear: number | null;
}
export interface Profile extends BaseProfile {
    FIDE: string;
    clubs?: string[];
    dateRenewed: {
        year: number;
        month: number;
        day: number;
    };
    federation: string;
    standard: ProfileRating;
    rapidplay: ProfileRating;
}
export interface RawHistory extends TableRow {
    List: string;
    StandardplayGrade: string;
    StandardplayGrade_1: string;
    RapidplayGrade: string;
    RapidplayGrade_1: string;
}
export interface History {
    year: number;
    month: string;
    standard: number;
    standardCategory: string;
    rapidplay: number;
    rapidplayCategory: string;
}
export interface RawProfile {
    Field: string;
    Value: string | null;
    Description: string | null;
}
export interface AdvancedSearch {
    firstName?: string;
    lastName?: string;
    middleName?: string;
    id?: string;
    isMember?: boolean;
    sex?: 'M' | 'F';
    club?: string;
}
export declare type keyType = keyof AdvancedSearch;
export declare const keys: ("firstName" | "lastName" | "middleName" | "id" | "isMember" | "sex" | "club")[];
export declare const SearchDefaults: AdvancedSearch;
export {};
