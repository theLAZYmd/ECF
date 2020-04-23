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
	static async search (argument: string, nb: number = 10, parse: boolean = true): Promise<{
		Users: SearchProfile[] | RawSearchProfile[],
		Clubs: RawSearchProfile[] | SearchProfile[]
	}> {
		return {
			Users: await ECF.searchUsers(argument, nb, parse),
			Clubs: await ECF.searchClubs(argument, nb, parse),
		}
	}
	
	/**
	 * Returns search data for users
	 */
	static async searchUsers(argument: string, nb: number = 10, parse: true | false = true): Promise<SearchProfile[] | RawSearchProfile[]> {
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
		if (parse) {
			let rawResults = Parse.userResults(results);
			return rawResults.filter((r) => {
				if (searchObj.lastName && !r.lastName.toLowerCase().startsWith(searchObj.lastName?.toLowerCase())) return false;
				if (searchObj.middleName && (!r.middleName || !r.middleName.toLowerCase().startsWith(searchObj.middleName?.toLowerCase())) )return false;
				if (searchObj.firstName && (!r.firstName || !r.firstName.toLowerCase().startsWith(searchObj.firstName?.toLowerCase()))) return false;
				return true;
			}).slice(0, nb);
		}
		return results.slice(0, nb);
	}
	
	/**
	 * Returns search data for clubs
	 */
	static async searchClubs (searchstring = '', nb: number = 10, parse = true): Promise<RawSearchProfile[] | SearchProfile[]>  {
		const uri = clubs.replace('|', searchstring);
		const data = await rp.get({
			uri,
			timeout: 10000
		});
		const tables = Get.tables(data);
		let results = tables[0].slice(0, nb) as RawSearchProfile[]
		if (parse) results = Parse.clubResults(results);
		return results;
	}

	/**
	 * Gets an ECF profile from a user's ID
	 * @param {string} id
	 * @returns {Promise<Table>}
	 * @public
	 */
	static async profile(code: string, nb: number = 10, parse: boolean = true): Promise<{
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
		let [grading, history] = tables.map(t => t.slice(0, 10)) as [RawProfile[], RawHistory[]];
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
		let results = tables[0].slice(0, 10) as RawSearchProfile[];
		//if (parse) return Parse.userResults(results);
		return results;
	}

}