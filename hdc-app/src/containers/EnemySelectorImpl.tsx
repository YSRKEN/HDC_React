import * as React from 'react';
import EnemySelector from '../components/EnemySelector';
import { getEnemyNames, getFinalAttack, getMapNames, getMapPositions } from '../services/rest';

const EnemySelectorImpl: React.FC<{setFinalAttack: (value: number) => void}> = ({setFinalAttack}) => {
	// 入力する設定項目に関するstate
	const [mapName, setMapName] = React.useState('1-1');
	const [mapList, setMapList] = React.useState(['1-1']);
	const [position, setPosition] = React.useState('A-1');
	const [positionList, setPositionList] = React.useState(['A-1']);
	const [enemyName, setEnemyName] = React.useState('駆逐イ級');
	const [enemyList, setEnemyList] = React.useState(['駆逐イ級']);
	const [disabled, setDisabled] = React.useState(true);
	const [selectorEnabled, setSelectorEnabled] = React.useState(false);
	const [formation, setFormation] = React.useState('単縦');
	const [status, setStatus] = React.useState('T有');
	const [attackType, setAttackType] = React.useState('航空');

	/**
	 * 初期化時の処理
	 */
	React.useEffect(() => {
		setDisabled(true);
		getMapNames().then(mapNames => {
			setMapList(mapNames);
			setDisabled(false);
		});
	}, []);
	
	/**
	 * マップ名が変わった際の処理
	 */
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
	
	/**
	 * 位置が変わった際の処理
	 */
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

	/**
	 * デバッグ表示用の処理
	 */
	const debug = async () => {
// tslint:disable-next-line: no-console
		console.log(`敵名=${enemyName} 敵陣形=${formation} 交戦形態=${status} 攻撃種=${attackType}`);
		const newFinalAttack = await getFinalAttack(mapName, position, enemyName, formation, status, attackType);
// tslint:disable-next-line: no-console
		console.log(`最終攻撃力=${newFinalAttack}`);
		setFinalAttack(newFinalAttack);
	}

	/**
	 * 仮想DOMを返却する
	 */
	return (<EnemySelector mapList={mapList} positionList={positionList}
		enemyList={enemyList} disabled={disabled} selectorEnabled={selectorEnabled}
		setMapName={setMapName} setPosition={setPosition} setEnemyName={setEnemyName}
		setSelectorEnabled={setSelectorEnabled} setFormation={setFormation}
		setStatus={setStatus} setAttackType={setAttackType} onClickButton={debug}/>);
}

export default EnemySelectorImpl;
