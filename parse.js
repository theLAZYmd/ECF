const regexes = {
	space: /\s+/g
};
const props = ['firstName', 'lastName', 'middleName', 'id', 'isMember', 'sex', 'club'];

class Parse {
	
	/**
	 * @typedef AdvancedSearch
	 * @property {string} firstName
	 * @property {string} lastName
	 * @property {string} middleName
	 * @property {string} id - What ECF calls 'reference'
	 * @property {Boolean} isMember
	 * @property {string} sex - M or F
	 * @property {string} club
	 */

	/**
	 * Parses a searchstring and returns a query object
	 * @param {string|AdvancedSearch} argument 
	 * @returns {AdvancedSearch}
	 */
	static searchstring (argument) {
		let def = props.reduce((acc, curr) => {
			acc[curr] = null;
			return acc;
		}, {});
		if (typeof argument === 'string') {
			if (argument.includes(',')) {
				let args = argument.split(',');
				if (args.length > 2) throw new SyntaxxError('max 1 comma in searchstring');
				def.lastName = args[0].trim();
				let remainder = args[1].split(regexes.space);
				def.firstName = remainder[0].trim();
				def.middleName = remainder.slice(1).join(' ');
			} else {
				let names = argument.split(regexes.space);
				def.lastName = names.pop();
				if (names[0]) def.firstName = names.shift();
				if (names[0]) def.middleName = names.join(' ');
			}
		} else
		if (argument instanceof Array) {
			let names = argument;
			def.lastName = names.pop();
			if (names[0]) def.firstName = names.shift();
			if (names[0]) def.middleName = names.join(' ');
		} else
		if (typeof argument === 'object') {
			for (let k of Object.keys(argument)) {
				if (props.indexOf(k) === -1) throw new SyntaxError('Invalid property ' + k);
				def[k] = argument[k];
			}
		} else throw new TypeError('Argument must be a string, array, or object');
		return def;
	}

	static grading (arr) {
		let header = '';
		return arr.reduce((acc, curr) => {
			if (curr.Field === 'Standard' || curr.Field === 'Rapid') {
				header = curr.Field;
				return acc;
			}
			if (header) {
				if (typeof acc[header] !== 'object') acc[header] = {};
				if (typeof curr.Value === 'string' && !curr.Value.startsWith('0') && !isNaN(Number(curr.Value))) curr.Value = Number(curr.Value);
				acc[header][curr.Field] = curr.Value;
			} else acc[curr.Field] = curr.Value;
			return acc;
		}, {});
	}

	static history (arr) {
		return arr.map(obj => {
			return {
				date: obj.list,
				stdCategory: obj['Standardplay Grade'] ? obj['Standardplay Grade'].slice(-1) : null,
				stdGrade: obj['Standardplay Grade'] ? Number(obj['Standardplay Grade'].slice(0, -1)) : null,
				rapidCategory: obj['Rapidplay Grade'] ? obj['Rapidplay Grade'].slice(-1) : null,
				rapidGrade: obj['Rapidplay Grade'] ? Number(obj['Rapidplay Grade'].slice(0, -1)) : null,
			}
		})
	}

	static userResults(arr) {
		return arr.reduce((acc, curr) => {
			let id = curr.Ref;
			acc[id] = { id };
			if (curr.Member) acc[id].member = curr.Member;
			if (curr.Name) {
				acc[id].name = curr.Name;
				let names = acc[id].name.split(',');
				acc[id].lastName = names.shift();
				if (names[0]) {
					let remainder = names[0].trim().split(regexes.space);
					acc[id].firstName = remainder.shift();
					if (remainder[0]) acc[id].middleName = remainder.join(' ');
				}
			}
			if (curr.Age) acc[id].age = Number(curr.Age);
			if (curr.Club) acc[id].club = curr.Club;
			if (curr.Standard) acc[id].age = Number(curr.Standard);
			if (curr.Previous) acc[id].age = Number(curr.Previous);
			if (curr.Rapidplay) acc[id].age = Number(curr.Rapidplay);
			return acc;
		}, {});
	}
	
	static clubResults(arr) {
		return arr;
	}

}

module.exports = Parse;