import cheerio from 'cheerio';
import { Table, TableRow } from './interfaces';

export default class Get {

	/**
	 * Builds an array of elements out of all the children of a given parent element
	 */
	static findChildren(obj: CheerioElement, filter: (element: CheerioElement) => boolean): CheerioElement[] {
		let children = [];
		for (let child of obj.children || []) {
			if (filter(child)) children.push(child);
			if (child.children) children.push(...Get.findChildren(child, filter));
		}
		return children;
	}

	/**
	 * Takes a given HTML element and nicely parses the text within
	 */
	static findText(obj: CheerioElement): string {
		let x = Get.findChildren(obj, (child: CheerioElement) => child.type === 'text' && !!child.data && !!child.data.toString().trim())
		return x.map((elem: CheerioElement) => {
			if (!elem || !elem.data) return '';
			return elem.data.toString().replace('*', '').trim()
		}).join('\n');
	}

	static tables(data: string | Buffer, {
		columnNames = []
	}: {
		columnNames?: string[]
	} = {}): [Table, Table] {
		let tables = [] as Table[];
		const $ = cheerio.load(data);
		$('table').each(function () {
			let table = [] as Table;
			let headers = [] as string[];
			let queries = ['thead tr th', 'tbody tr th'];
			let q = queries.shift();
			do {
				let j = 0;
				$(this).find(q as string).each(function (i, element) {
					let colspan = element.attribs.colspan ? Number(element.attribs.colspan) : 1;
					let k = 0;
					while (colspan >= 1) {
						let text = Get.findText(element).replace(/\s+/g, '');
						let str = text;
						while (headers.includes(str)) {
							k++;
							str = text + '_' + k.toString();
						} 
						headers[i + j] = str;
						if (colspan > 1) j++;
						colspan--;
					}
				});
				q = queries.shift();
			} while (!headers[0] && q);
			let last = '';
			$(this).find('tbody tr').each(function (i: number) {
				let obj = {} as TableRow;
				$(this).find('td').each(function (j, element) {
					let header = headers[j] || columnNames[j];
					if (!header) return;
					if (obj[header]) return;
					let text = '';
					if (element.type !== 'text') {
						text = Get.findText(element);
					}
					obj[header] = text || '';
				});
				if (Object.values(obj).every(v => !v)) return;
				let header = headers[0] || columnNames[0];
				if (!obj[header]) obj[header] = last;
				table.push(obj);
				last = obj[header] as string;
			});
			tables.push(table);
		});
		return tables as [Table, Table];
	}
}