import { AdvancedSearch, RawSearchProfile, SearchProfile, RawHistory, History, RawProfile, Profile } from "./interfaces";
export default class Parse {
    /**
     * Parses a searchstring and returns a query object
     */
    static searchstring(argument: string | AdvancedSearch): AdvancedSearch;
    static grading(arr: RawProfile[]): Profile;
    static history(arr: RawHistory[]): History[];
    static userResults(arr: RawSearchProfile[]): SearchProfile[];
    static clubResults<T>(arr: T[]): T[];
}
