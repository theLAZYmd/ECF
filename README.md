# ECF Query Database

Scrapes the ECF Grading Database for results  
Returns a promise (that needs to be awaited or .then-ed) to user data.
Comes with typescript support.

## Dependencies
- [cheerio](https://www.npmjs.com/package/cheerio)
- [request](https://www.npmjs.com/package/request)
- [request-promise](https://www.npmjs.com/package/request-promise)

## Installation
- `npm install ecf` (includes its own index.d.ts file)
```js
const ECF = require('ecf');
```

## Usage

```js
ECF.endpointName(queryParam, parse?)
```
- Call any endpoint in this package by simply appending it to the package name as a method.
- Each endpoint takes a query parameter, be it an ID, a search parameter, or a name. Use it as the first argument to the function.
- Each endpoint takes a 'parse' Boolean as the second parameter. The library supports parsing the grabbed data from the ECF website into a nice, human-readable, format (which can be understood by trying each one). Set `parse` as `true` (default) to use this mode, otherwise set as `false` to just get the raw table rows.

## Endpoints

1. **ECF.profile()**
	- Gets a user's profile by ID
	- For a known user with a specific ECF ID, a user's data can be generated by:
	```js
	const ECF = require('ecf');

	(async () => {
		console.log(await ECF.profile('170263E'));
		//returns Gawain Jones' ECF profile as an object
	})();
	```

2. **ECF.club()**
	- Gets a user's profile using a club ID
	```js
	const ECF = require('ecf');

	(async () => {
		console.log(await ECF.profile('1100'));
		//returns users from the Oxford University Chess Club
	})();
	```

3. **ECF.searchUsers()**
	- Generates a list of possible users matching a search query.
	- List is in array form, with each element being a matching user.
	- Takes a query parameter of a string (name) or an 'AdvancedSearch' parameter - an object with possible fields 'firstName', 'lastName', 'middleName', 'id', 'isMember', 'sex', 'club'
	```js
	const ECF = require('ecf');

	(async () => {
		console.log(await ECF.searchUsers('jones'));
		//returns a list of users with the surname Jones
		console.log(await ECF.searchUsers('jones, gawain'));
		//returns a list of users with the surname Jones and first letter 'G'
		console.log(await ECF.searchUsers({
			firstName: 'Gawain',
			lastName: 'Jones'
		}));
		//returns a list of users with the surname Jones and first letter 'G'
	})();
	```

4. **ECF.searchClubs()**
	- Generates a list of clubs across the country which have a name beginning with the specified query string
	- Takes a single string argument
	```js
	const ECF = require('ecf');

	(async () => {
		console.log(await ECF.searchClubs('oxford'));
		//returns a list of clubs with 'oxford' in their name
	})();
	```

5. **ECF.search()**
	- Generates a list of both users and clubs matching a query parameter
	- Takes a single string argument
	- Returns an object with 'Users' and 'Clubs' properties
	```js
	const ECF = require('ecf');

	(async () => {
		console.log(await ECF.searchClubs('oxford'));
	})();
	```

## Examples

- **Find a specific user**
	```js
	(async () => {
		let result = await ecf.searchUsers(arguments[0], true);
		let entry = rest.find(v => v.firstName === 'Gawain');
		console.log(JSON.stringify(entry, null, 4));
	})();
	```
	```json
	{
		"id": "170263E",
		"member": "GOLD",
		"name": "Jones, Gawain CB",
		"lastName": "Jones",
		"firstName": "Gawain",
		"middleName": "CB",
		"club": "4NCL Guildford",
		"standard": 275,
		"previous": null,
		"rapidplay": 277
	}
	```