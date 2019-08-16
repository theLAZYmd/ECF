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

	static findText(obj) {
		let x = Get.findChildren(obj, child => child.type === 'text' && child.data && child.data.toString().trim())
		if (!x[0] || !x[0].data) return null;
		return x
			.shift()
			.data
			.toString()
			.replace('*', '')
			.trim();
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
				headers.push(Get.findText(element));
			});
			if (!headers[0]) {
				let inc = 0;
				$(this).find('tbody tr th').each(function (i, element) {
					headers[i + inc] = Get.findText(element);
					if (element.attribs.colspan === '2') {
						inc++;
						headers[i + inc] = Get.findText(element);
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
						element = Get.findText(element);
					}
					obj[header] = element;
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