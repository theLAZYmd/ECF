const cheerio = require('cheerio');
const rp = require('request-promise');

const Get = require('./get');
const Parse = require('./parse');

const profile = 'http://www.ecfgrading.org.uk/new/player.php?PlayerCode=|';
const users = 'http://ecfgrading.org.uk/new/glist.php?&player=|';
const clubs = 'http://ecfgrading.org.uk/new/glist.php?&club=|';
const club = 'http://ecfgrading.org.uk/new/glist.php?Code=|';
const fide = 'http://ratings.fide.com/card.phtml?event=|';

class ECF {

	/**
	 * Returns search data for clubs
	 * @param {string|AdvancedSearch} argument 
	 * @param {Boolean} parse - Parses the raw table rows into a usable form specific to that data type
	 */
	static async search () {
		return {
			Users: await ECF.searchUsers(...arguments),
			Clubs: await ECF.searchClubs(...arguments),
		}
	}
	
	/**
	 * Returns search data for users
	 * @param {string|AdvancedSearch} argument 
	 * @param {Boolean} parse - Parses the raw table rows into a usable form specific to that data type
	 */
	static async searchUsers (argument, parse = true) {
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
		let [results] = tables;
		if (parse) results = Parse.userResults(results);
		return results;
	}
	
	/**
	 * Returns search data for users
	 * @param {string|AdvancedSearch} searchstring 
	 * @param {Boolean} parse - Parses the raw table rows into a usable form specific to that data type
	 */
	static async searchClubs (searchstring = '', parse = true) {
		const uri = clubs.replace('|', searchstring);
		const data = await rp.get({
			uri,
			timeout: 10000
		});
		const tables = Get.tables(data);
		let [results] = tables;
		if (parse) results = Parse.clubResults(results);
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

	/**
	 * Gets an ECF profile from a user's ID
	 * @param {string} id
	 * @returns {Promise<Table>}
	 * @public
	 */
	static async club (code, parse = true) {
		const uri = club.replace('|', code);
		const data = await rp.get({
			uri,
			timeout: 10000
		});
		const tables = Get.tables(data);
		let [results] = tables;
		if (parse) results = Parse.userResults(results);
		return results;
	}

}

module.exports = ECF;