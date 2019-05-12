import * as React from 'react';
import { Form } from 'react-bootstrap';

const EnemySelector: React.FC<{mapList: string[]}> = ({mapList}) => {

	const [selectEnemyFlg, setSelectEnemyFlg] = React.useState<boolean>(false);
	const [positionList] = React.useState<string[]>(['A', 'B', 'C']);
	const [enemyList] = React.useState<string[]>(['駆逐イ級', '駆逐ロ級', '駆逐ハ級']);
	const [engFormList] = React.useState<string[]>(['T有', '同航', '反航', 'T不']);
	const [attackTypeList] = React.useState<string[]>(['航空', '砲撃', '対潜', '雷撃']);

	/* 「仮想敵を選択」チェックを押した際の動き */
	const onChangeCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSelectEnemyFlg(e.target.checked);
	};

	return (<Form.Group className='d-flex'>
		<Form.Check className='text-nowrap mt-1 mr-3' type='checkbox' label='仮想敵を選択' onChange={onChangeCheck}/>
		<Form.Control as='select' disabled={!selectEnemyFlg} style={{'width': 'auto'}} className='mr-1'>
			{mapList.map(mapName => (<option key={mapName}>{mapName}</option>))}
		</Form.Control>
		<Form.Control as='select' disabled={!selectEnemyFlg} style={{'width': 'auto'}} className='mr-1'>
			{positionList.map(positionName => (<option key={positionName}>{positionName}</option>))}
		</Form.Control>
		<Form.Control as='select' disabled={!selectEnemyFlg} style={{'width': 'auto'}} className='mr-1'>
			{enemyList.map(enemyName => (<option key={enemyName}>{enemyName}</option>))}
		</Form.Control>
		<Form.Control as='select' disabled={!selectEnemyFlg} style={{'width': 'auto'}} className='mr-1'>
			{engFormList.map(engFormName => (<option key={engFormName}>{engFormName}</option>))}
		</Form.Control>
		<Form.Control as='select' disabled={!selectEnemyFlg} style={{'width': 'auto'}}>
			{attackTypeList.map(attackTypeName => (<option key={attackTypeName}>{attackTypeName}</option>))}
		</Form.Control>
	</Form.Group>);
}

export default EnemySelector;
