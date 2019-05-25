import * as React from 'react';
import { Button, Form } from 'react-bootstrap';

const EnemySelector: React.FC<{
	mapList: string[], setMapName: (value: string) => void,
	positionList: string[], setPositionName: (value: string) => void,
	enemyList: string[], setEnemyName: (value: string) => void,
	setEnemyFormation: (value: string) => void, setEnemyAttackName: (value: string) => void,
	calcFinalAttack: () => void}>
	= ({mapList, setMapName, positionList, setPositionName, enemyList, setEnemyName,
		setEnemyFormation, setEnemyAttackName, calcFinalAttack}) => {

	const [selectEnemyFlg, setSelectEnemyFlg] = React.useState<boolean>(false);
	const [engFormList] = React.useState<string[]>(['T有', '同航', '反航', 'T不']);
	const [attackTypeList] = React.useState<string[]>(['航空', '砲撃', '対潜', '雷撃', '夜戦']);

	/* 「仮想敵を選択」チェックを押した際の動き */
	const onChangeCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSelectEnemyFlg(e.target.checked);
	};

	/* マップを選択した際の動き */
	const onChangeMap = (e: React.FormEvent<any>) => {
		setMapName(e.currentTarget.value);
	};

	/* 位置を選択した際の動き */
	const onChangePosition = (e: React.FormEvent<any>) => {
		setPositionName(e.currentTarget.value);
	};

	/* 艦名を選択した際の動き */
	const onChangeEnemy = (e: React.FormEvent<any>) => {
		setEnemyName(e.currentTarget.value);
	};

	/* 陣形を選択した際の動き */
	const onChangeFormation = (e: React.FormEvent<any>) => {
		setEnemyFormation(e.currentTarget.value);
	};

	/* 攻撃種を選択した際の動き */
	const onChangeAttackName = (e: React.FormEvent<any>) => {
		setEnemyAttackName(e.currentTarget.value);
	};

	return (<Form.Group className='d-flex'>
		<Form.Check className='text-nowrap mt-1 mr-3' type='checkbox' label='仮想敵を選択' onChange={onChangeCheck}/>
		<Form.Control as='select' disabled={!selectEnemyFlg} style={{'width': 'auto'}} className='mr-1'
			onChange={onChangeMap}>
			{mapList.map(mapName => (<option key={mapName}>{mapName}</option>))}
		</Form.Control>
		<Form.Control as='select' disabled={!selectEnemyFlg} style={{'width': 'auto'}} className='mr-1'
			onChange={onChangePosition}>
			{positionList.map(positionName => (<option key={positionName}>{positionName}</option>))}
		</Form.Control>
		<Form.Control as='select' disabled={!selectEnemyFlg} style={{'width': 'auto'}} className='mr-1'
			onChange={onChangeEnemy}>
			{enemyList.map(enemyName => (<option key={enemyName}>{enemyName}</option>))}
		</Form.Control>
		<Form.Control as='select' disabled={!selectEnemyFlg} style={{'width': 'auto'}} className='mr-1'
			onChange={onChangeFormation}>
			{engFormList.map(engFormName => (<option key={engFormName}>{engFormName}</option>))}
		</Form.Control>
		<Form.Control as='select' disabled={!selectEnemyFlg} style={{'width': 'auto'}} className='mr-1'
			onChange={onChangeAttackName}>
			{attackTypeList.map(attackTypeName => (<option key={attackTypeName}>{attackTypeName}</option>))}
		</Form.Control>
		<Button className='text-nowrap' onClick={calcFinalAttack}>反映</Button>
	</Form.Group>);
}

export default EnemySelector;
