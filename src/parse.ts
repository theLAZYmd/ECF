import {
	AdvancedSearch,
	keys,
	SearchDefaults,
	keyType,
	RawSearchProfile,
	SearchProfile,
	RawHistory, 
	History,
	RawProfile,
	Profile,
	ProfileRating
} from "./interfaces";
import * as regexes from './utils/regexes';

export default class Parse {

	/**
	 * Parses a searchstring and returns a query object
	 */
	static searchstring(argument: string | AdvancedSearch): AdvancedSearch {
		let def = Object.assign({}, SearchDefaults) as AdvancedSearch;
		if (typeof argument === 'string') {
			if (argument.includes(',')) {
				let args = argument.split(',');
				if (args.length > 2) throw new SyntaxError('max 1 comma in searchstring');
				def.lastName = args[0].trim();
				let remainder = args[1].split(regexes.spaces);
				def.firstName = remainder[0].trim();
				def.middleName = remainder.slice(1).join(' ');
			} else {
				let names = argument.split(regexes.spaces);
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
			for (let k of Object.keys(argument) as (keyof AdvancedSearch)[]) {
				if (keys.indexOf(k as keyType) === -1) throw new SyntaxError('Invalid property ' + k);
				if (argument[k]) def[k] = argument[k] as undefined;
			}
		} else throw new TypeError('Argument must be a string, array, or object');
		return def;
	}

	static grading(arr: RawProfile[]): Profile {
		let obj = arr.reduce((acc, curr) => {
			acc[curr.Field] = curr.Value;
			return acc;
		}, {} as RawSearchProfile);
		let initial = this.userResults([obj])[0] as unknown as Profile;
		let date = new Date(((arr.find(entry => entry.Field === 'Class') as RawProfile)
			.Description || '')
			.split('-')
			.reverse()
			.join('-')
		);
		initial.clubs = arr.find((elem) => elem.Field === 'Club' || elem.Field === 'Club(s)')?.Value?.split('\n');
		if (obj.Nation) initial.federation = obj.Nation;
		if (obj.FIDE) initial.FIDE = obj.FIDE;
		initial.dateRenewed = {
			year: date.getFullYear(),
			month: date.getMonth(),
			day: date.getDate()
		};
		let standardIndex = arr.findIndex(element => element.Field === 'Standard');
		initial.standard = arr.slice(standardIndex + 1, standardIndex + 6)
			.reduce((acc, curr) => {
				if (curr.Field === 'Category') acc.category = curr.Value;
				else if (curr.Field === 'Grade') {
					if (!acc.rating) acc.rating = Number(curr.Value);
					else acc.unamendedRating = Number(curr.Value);
				} else if (curr.Field === 'Games') {
					if (!acc.played) acc.played = Number(curr.Value);
					else acc.playedLastYear = Number(curr.Value);
				}
				return acc;
			}, {} as ProfileRating);
		let rapidIndex = arr.findIndex(element => element.Field === 'Rapid');
		initial.rapidplay = arr.slice(rapidIndex + 1, rapidIndex + 6)
			.reduce((acc, curr) => {
				if (curr.Field === 'Category') acc.category = curr.Value;
				else if (curr.Field === 'Grade') {
					if (!acc.rating) acc.rating = Number(curr.Value);
					else acc.unamendedRating = Number(curr.Value);
				} else if (curr.Field === 'Games') {
					if (!acc.played) acc.played = Number(curr.Value);
					else acc.playedLastYear = Number(curr.Value);
				}
				return acc;
			}, {} as ProfileRating);
		return initial;
	}

	static history(arr: RawHistory[]): History[] {
		return arr.map((curr) => {
			let [month, _year] = curr.List.split(' ');
			let year = parseInt(_year);
			let standard = parseInt(curr.StandardplayGrade);
			let standardCategory = curr.StandardplayGrade.slice(-1);
			let rapidplay = parseInt(curr.RapidplayGrade_1);
			let rapidplayCategory = curr.RapidplayGrade_1.slice(-1);
			return { year, month, standard, standardCategory, rapidplay, rapidplayCategory };
		});
	}

	static userResults(arr: RawSearchProfile[]): SearchProfile[] {
		return arr.map((curr) => {
			let obj = {} as SearchProfile;
			obj.id = curr.Ref;
			if (curr.Member) obj.member = curr.Member;
			if (curr.Name) {
				obj.name = curr.Name;
				let names = obj.name.split(',');
				obj.lastName = names.shift() as string;
				if (names[0]) {
					let remainder = names[0].trim().split(regexes.spaces);
					obj.firstName = remainder.shift() as string;
					if (remainder[0]) obj.middleName = remainder.join(' ');
				}
			}
			if (curr.Age) obj.age = Number(curr.Age);
			if (curr.Club) obj.club = curr.Club;

			obj.standard = {
				rating: Number(curr.Standard),
				category: curr.Standard_1,
				previousRating: Number(curr.Previous),
				previousCategory: curr.Previous_1
			};
			obj.rapidplay = {
				rating: Number(curr.Rapidplay),
				category: curr.Rapidplay_1,
				previousRating: Number(curr.Previous_2),
				previousCategory: curr.Previous_3
			};

			return obj;
		});
	}
	
	static clubResults<T>(arr: T[]): T[] {
		return arr;
	}

}