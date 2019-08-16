class Parse {
	
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
				stdGrade: obj['Standardplay Grade'] ? obj['Standardplay Grade'].slice(0, -1) : null,
				rapidCategory: obj['Rapidplay Grade'] ? obj['Rapidplay Grade'].slice(-1) : null,
				rapidGrade: obj['Rapidplay Grade'] ? obj['Rapidplay Grade'].slice(0, -1) : null,
			}
		})
	}
}

module.exports = Parse;