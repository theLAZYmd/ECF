const cheerio = require('cheerio');
const rp = require('request-promise');

const Get = require('./get');
const Parse = require('./parse');

const league = 'http://www.oxfordfusion.com/oca/GetLeagueSummaryResults.cfm?LeagueID=|&TeamID=|&Org=1';
const ecf = 'http://www.ecfgrading.org.uk/new/player.php?PlayerCode=|';
const fide = 'http://ratings.fide.com/card.phtml?event=|';

class ECF {

	/**
	 * Gets an ECF profile from a user's ID
	 * @param {string} id
	 * @returns {Promise<Table>}
	 * @public
	 */
	static async profile (code, parse = true) {
		const uri = ecf.replace('|', code);
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

	async team () {
		let uri = league.replace('|', ids[0][0]).replace('|', ids[0][1]);
		let data = await rp.get({
			uri,
			timeout: 10000
		});
		let $ = cheerio.load(data);
		$('table tr').each(function (i, element) {
			console.log(element.innerHTML);
		});
	}

}

module.exports = ECF;