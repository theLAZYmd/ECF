const cheerio = require('cheerio');
const rp = require('request-promise');

const Get = require('./get');
const Parse = require('./parse');

const league = 'http://www.oxfordfusion.com/oca/GetLeagueSummaryResults.cfm?LeagueID=|&TeamID=|&Org=1';
const profile = 'http://www.ecfgrading.org.uk/new/player.php?PlayerCode=|';
const search = 'http://ecfgrading.org.uk/new/glist.php?&player=|';
const fide = 'http://ratings.fide.com/card.phtml?event=|';

class ECF {

	
	/**
	 * Returns search data 
	 * @param {string|AdvancedSearch} argument 
	 */
	static async search (argument, {
			parse = false
	}) {
		const searchObj = Parse.searchstring(argument);
		if (!searchObj.lastName) throw new SyntaxError('Must specifhy a last name to search');
		let query = searchObj.lastName;
		if (searchObj.firstName) query += ',%20' + searchObj.firstName;
		const uri = search.replace('|', query);
		const data = await rp.get({
			uri,
			timeout: 10000
		});
		const tables = Get.tables(data);
		let [results] = tables;
		if (parse) results = Parse.results(results);
		return results;
	}

	/**
	 * Gets an ECF profile from a user's ID
	 * @param {string} id
	 * @returns {Promise<Table>}
	 * @public
	 */
	static async profile (code, parse = true) {
		const uri = profile.replace('|', code);
		const data = await rp.get({
			uri,
			timeout: 10000
		});
		const tables = Get.tables(data);
		let [grading, history] = tables;
		if (parse) {
			grading = Parse.grading(grading);
			history = Parse.history(history);
		}
		return {
			grading, history
		};
	}

}

module.exports = ECF;