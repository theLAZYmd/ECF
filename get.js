const cheerio = require('cheerio');

class Get {

	static findChildren(obj, func) {
		let children = [];
		for (let child of obj.children || []) {
			if (func(child)) children.push(child);
			if (child.children) children.push(...Get.findChildren(child, func));
		}
		return children;
	}
	
	/**
	 * @typedef Table
	 * @type {Object[]} where each Object represents a 'row' with key values taken from the table headers
	 */

	/**
	 * 
	 * @param {string} data - html data from which one wants to parse tables
	 * @param {Object} options
	 * @property {string[]} columNames
	 * @property {Boolean} parse
	 * @returns {Table[]}
	 * @private
	 */
	static tables(data, {
		columnNames = []
	} = {}) {
		let tables = [];
		const $ = cheerio.load(data);
		$('table').each(function () {
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
					if (element.type !== 'text') {
						let elements = Get.findChildren(element, child => child.type === 'text' && child.data && child.data.toString().trim());
						element = elements.shift();
					}
					let str = element ? element.data.toString().trim() : null;
					obj[header] = str;
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
}

module.exports = Get;