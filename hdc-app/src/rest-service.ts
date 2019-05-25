// const SERVER_URL = 'https://aerial-combat-service.appspot.com';
const SERVER_URL = 'http://localhost:8080';

export const readJson = (endpoint: string, option?: string) => {
	const url = option !== undefined ? `${SERVER_URL}/${endpoint}?${option}` : `${SERVER_URL}/${endpoint}`;
	return fetch(url).then(result => {
		return result.json();
	});
};
