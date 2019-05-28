// const SERVER_URL = 'https://aerial-combat-service.appspot.com';
const SERVER_URL = 'http://localhost:8080';

const readJson = <T>(endpoint: string, option?: string): Promise<T> => {
	const url = option !== undefined ? `${SERVER_URL}/${endpoint}?${option}` : `${SERVER_URL}/${endpoint}`;
	return fetch(url).then(result => {
		return result.json();
	});
};

export const getMapNames = () => {
	return readJson<string[]>('map-names');
}

export const getMapPositions = (mapName: string) => {
	return readJson<string[]>('map-positions', `map=${mapName}`);
}

export const getEnemyNames = async (mapName: string, positionName: string) => {
	// APIを叩いて読み取り
	const rawList = await readJson<{'enemy': Array<{'name': string, 'id': number}>}>('enemy-names', `map=${mapName}&point=${positionName}&level=3`);

	// 同一IDのデータの重複を省く
	const temp: Map<number, string> = new Map();
	for (const record of rawList.enemy) {
		temp.set(record.id, record.name);
	}

	// 艦名のリストを返す
	return Array.from(temp.values());
}

export const getFinalAttack = async (mapName: string, position:string,
	enemyName: string, formation: string, status: string, attackType: string) => {
	const getParameter = `map=${mapName}&point=${position}&name=${enemyName}&formation=${formation}&status=${status}&type=${attackType}`;
	const rawData = await readJson<{'value': number}>('final-attack', getParameter);

	return rawData.value;
}
