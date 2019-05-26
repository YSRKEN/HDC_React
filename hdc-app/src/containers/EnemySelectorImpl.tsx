import * as React from 'react';
import EnemySelector from '../components/EnemySelector';
import { getEnemyNames, getMapNames, getMapPositions } from '../services/rest';

const EnemySelectorImpl: React.FC = () => {
	const [mapName, setMapName] = React.useState('1-1');
	const [mapList, setMapList] = React.useState(['1-1']);
	const [position, setPosition] = React.useState('A-1');
	const [positionList, setPositionList] = React.useState(['A-1']);
	const [enemyName, setEnemyName] = React.useState('駆逐イ級');
	const [enemyList, setEnemyList] = React.useState(['駆逐イ級']);
	const [disabled, setDisabled] = React.useState(true);

	React.useEffect(() => {
		setDisabled(true);
		getMapNames().then(mapNames => {
			setMapList(mapNames);
			setDisabled(false);
		});
	}, []);
	
	React.useEffect(() => {
		setDisabled(true);
		getMapPositions(mapName).then(mapPositions => {
			if (!mapPositions.includes(position)) {
				setPosition(mapPositions[0]);
			}
			setPositionList(mapPositions);
			setDisabled(false);
		});
	}, [mapName]);
	
	React.useEffect(() => {
		setDisabled(true);
		getEnemyNames(mapName, position).then(enemyNames => {
			if (!enemyNames.includes(enemyName)) {
				setEnemyName(enemyNames[0]);
			}
			setEnemyList(enemyNames);
			setDisabled(false);
		});
	}, [position]);

	const debug = () => {
		window.alert(`敵名=${enemyName}`);
	}

	return (<EnemySelector mapList={mapList} positionList={positionList}
		enemyList={enemyList} disabled={disabled}
		setMapName={setMapName} setPosition={setPosition} setEnemyName={setEnemyName}
		setDisabled={setDisabled} onClickButton={debug}/>);
}

export default EnemySelectorImpl;
