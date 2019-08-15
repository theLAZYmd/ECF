const cheerio = require('cheerio');
const rp = require('request-promise');

const league = 'http://www.oxfordfusion.com/oca/GetLeagueSummaryResults.cfm?LeagueID=|&TeamID=|&Org=1';
const ecf = 'http://www.ecfgrading.org.uk/new/player.php?PlayerCode=|';
const fide = 'http://ratings.fide.com/card.phtml?event=|';

class ECF {

	/**
	 * @typedef Table
	 * @type {Object[]} where each Object represents a 'row' with key values taken from the table headers
	 */

	/**
	 * 
	 * @param {string} data - html data from which one wants to parse tables
	 * @returns {Table[]}
	 * @private
	 */
	static getTables(data, columnNames = []) {
		let tables = [];
		const $ = cheerio.load(data);
		$('table').each(function () {
			const name = $(this).find('h3').text();
			const innerText = $(this).find('h3')[0].childNodes.find(e => e.type === 'text').nodeValue.toString().trim();
			let table = [];
			let headers = [];
			$(this).find('thead tr th').each(function (i, element) {
				headers.push(element.firstChild.data);
			});
			if (!headers[0]) {
				let inc = 0;
				$(this).find('tbody tr th').each(function (i, element) {
					headers[i + inc] = element.firstChild.data;
					if (element.attribs.colspan === '2') {
						inc++;
						headers[i + inc] = element.firstChild.data;
					}
				});
			}
			let last = '';
			$(this).find('tbody tr').each(function (i) {
				let obj = {};
				$(this).find('td').each(function (j, element) {
					let header = headers[j] || columnNames[j];
					if (!header) return;
					if (obj[header]) return;
					while (element.type !== 'text') {
						if (!element.firstChild) return;
						element = element.firstChild;
					}
					let str = element.data.toString().trim();
					obj[header] = str || null;
				});
				if (Object.values(obj).every(v => !v)) return;
				let header = headers[0] || columnNames[0];
				if (!obj[header]) obj[header] = last;
				table.push(obj);
				last = obj[header];
			});
			tables.push(table);
		});
		return tables;
	}

	/**
	 * Gets an ECF profile from a user's ID
	 * @param {string} id
	 * @returns {Promise<Table>}
	 * @public
	 */
	static async profile (code) {
		const uri = ecf.replace('|', code);
		const data = await rp.get({
			uri,
			timeout: 10000
		});
		const table = ECF.getTables(data);
		return table;
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