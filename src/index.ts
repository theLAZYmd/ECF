import { RawSearchProfile, RawProfile, SearchProfile, RawHistory, Table, Profile, History } from "./interfaces";
import rp from 'request-promise';
import Get from './get';
import Parse from './parse';

const profile = 'http://www.ecfgrading.org.uk/new/player.php?PlayerCode=|';
const users = 'http://ecfgrading.org.uk/new/glist.php?&player=|';
const clubs = 'http://ecfgrading.org.uk/new/glist.php?&club=|';
const club = 'http://ecfgrading.org.uk/new/glist.php?Code=|';
//const fide = 'http://ratings.fide.com/card.phtml?event=|';

export default class ECF {

	/**
	 * Searches both clubs and users
	 */
	static async search (argument: string, parse: boolean = true): Promise<{
		Users: SearchProfile[] | RawSearchProfile[],
		Clubs: RawSearchProfile[] | SearchProfile[]
	}> {
		return {
			Users: await ECF.searchUsers(argument, parse),
			Clubs: await ECF.searchClubs(argument, parse),
		}
	}
	
	/**
	 * Returns search data for users
	 */
	static async searchUsers(argument: string, parse: true | false = true): Promise<SearchProfile[] | RawSearchProfile[]> {
		const searchObj = Parse.searchstring(argument);
		if (!searchObj.lastName) throw new SyntaxError('Must specify a last name to search');
		let query = searchObj.lastName;
		if (searchObj.firstName) query += ',%20' + searchObj.firstName;
		const uri = users.replace('|', query);
		const data = await rp.get({
			uri,
			timeout: 10000
		});
		const tables = Get.tables(data);
		let results = tables[0] as RawSearchProfile[];
		if (parse) return Parse.userResults(results);
		return results;
	}
	
	/**
	 * Returns search data for clubs
	 */
	static async searchClubs (searchstring = '', parse = true): Promise<RawSearchProfile[] | SearchProfile[]>  {
		const uri = clubs.replace('|', searchstring);
		const data = await rp.get({
			uri,
			timeout: 10000
		});
		const tables = Get.tables(data);
		let results = tables[0] as RawSearchProfile[]
		if (parse) results = Parse.clubResults(results);
		return results;
	}

	/**
	 * Gets an ECF profile from a user's ID
	 * @param {string} id
	 * @returns {Promise<Table>}
	 * @public
	 */
	static async profile(code: string, parse: boolean = true): Promise<{
		grading: Profile,
		history: History[]
	} | {
		grading: RawProfile[],
		history: RawHistory[]
	}> {
		const uri = profile.replace('|', code);
		const data = await rp.get({
			uri,
			timeout: 10000
		}) as string;
		const tables = Get.tables(data);
		let [grading, history] = tables as unknown as [RawProfile[], RawHistory[]];
		if (parse) {
			return {
				grading: Parse.grading(grading),
				history: Parse.history(history)
			};
		};
		return { grading, history };
	}

	/**
	 * Gets an ECF club from a club's ID
	 */
	static async club(code: string, parse: boolean = true): Promise<Table> {
		const uri = club.replace('|', code);
		const data = await rp.get({
			uri,
			timeout: 10000
		});
		const tables = Get.tables(data)
		let results = tables[0] as RawSearchProfile[];
		//if (parse) return Parse.userResults(results);
		return results;
	}

}