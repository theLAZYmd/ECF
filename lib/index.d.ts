import { RawSearchProfile, RawProfile, SearchProfile, RawHistory, Table, Profile, History } from "./interfaces";
export default class ECF {
    /**
     * Searches both clubs and users
     */
    static search(argument: string, parse?: boolean): Promise<{
        Users: SearchProfile[] | RawSearchProfile[];
        Clubs: RawSearchProfile[] | SearchProfile[];
    }>;
    /**
     * Returns search data for users
     */
    static searchUsers(argument: string, parse?: boolean): Promise<SearchProfile[] | RawSearchProfile[]>;
    /**
     * Returns search data for clubs
     */
    static searchClubs(searchstring?: string, parse?: boolean): Promise<RawSearchProfile[] | SearchProfile[]>;
    /**
     * Gets an ECF profile from a user's ID
     * @param {string} id
     * @returns {Promise<Table>}
     * @public
     */
    static profile(code: string, parse?: boolean): Promise<{
        grading: Profile;
        history: History[];
    } | {
        grading: RawProfile[];
        history: RawHistory[];
    }>;
    /**
     * Gets an ECF club from a club's ID
     */
    static club(code: string, parse?: boolean): Promise<Table>;
}
