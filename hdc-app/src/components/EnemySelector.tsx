import * as React from 'react';
import { Button, Form } from 'react-bootstrap';

const FORMATION_LIST = ['T有', '同航', '反航', 'T不'];
const ATTACK_TYPE_LIST = ['航空', '砲撃', '対潜', '雷撃', '夜戦'];

// tslint:disable-next-line: interface-name
interface EnemySelectorProps {
	mapList: string[]
	positionList: string[]
	enemyList: string[]
	disabled: boolean
	selectorEnabled: boolean
	setMapName: (value: string) => void
	setPosition: (value: string) => void
	setEnemyName: (value: string) => void
	setSelectorEnabled: (value: boolean) => void
	onClickButton: () => void
}

const EnemySelector: React.FC<EnemySelectorProps> = ({
	mapList, positionList, enemyList, disabled, selectorEnabled, setMapName,
	setPosition, setEnemyName, onClickButton, setSelectorEnabled
}) => {
	/* 「仮想敵を選択」チェックを押した際の動き */
	const onChangeCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSelectorEnabled(e.target.checked);
	};

	/* マップを選択した際の動き */
	const onChangeMap = (e: React.FormEvent<any>) => {
		setMapName(e.currentTarget.value);
	};

	/* 位置を選択した際の動き */
	const onChangePosition = (e: React.FormEvent<any>) => {
		setPosition(e.currentTarget.value);
	};

	/* 艦名を選択した際の動き */
	const onChangeEnemy = (e: React.FormEvent<any>) => {
		setEnemyName(e.currentTarget.value);
	};

	const isFormDisable = () => !selectorEnabled || disabled;

	return (
		<Form.Group className='d-flex'>
			<Form.Check className='text-nowrap mt-1 mr-3' type='checkbox' label='仮想敵を選択'
				onChange={onChangeCheck}/>
			<Form.Control as='select' disabled={isFormDisable()} style={{'width': 'auto'}} className='mr-1'
				onChange={onChangeMap}>
				{mapList.map(mapName => (<option key={mapName}>{mapName}</option>))}
			</Form.Control>
			<Form.Control as='select' disabled={isFormDisable()} style={{'width': 'auto'}} className='mr-1'
				onChange={onChangePosition}>
				{positionList.map(position => (<option key={position}>{position}</option>))}
			</Form.Control>
			<Form.Control as='select' disabled={isFormDisable()} style={{'width': 'auto'}} className='mr-1'
				onChange={onChangeEnemy}>
				{enemyList.map(enemyName => (<option key={enemyName}>{enemyName}</option>))}
			</Form.Control>
			<Form.Control as='select' disabled={isFormDisable()} style={{'width': 'auto'}} className='mr-1'>
				{FORMATION_LIST.map(formation => (<option key={formation}>{formation}</option>))}
			</Form.Control>
			<Form.Control as='select' disabled={isFormDisable()} style={{'width': 'auto'}} className='mr-1'>
				{ATTACK_TYPE_LIST.map(attackType => (<option key={attackType}>{attackType}</option>))}
			</Form.Control>
			<Button className='text-nowrap' onClick={onClickButton} disabled={isFormDisable()}>反映</Button>
		</Form.Group>
	);
};

export default EnemySelector;
