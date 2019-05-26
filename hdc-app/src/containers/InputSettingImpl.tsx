import * as React from 'react';
import { loadSettingInteger, saveSettingNumber, saveSettingString } from 'src/data_store';
import InputSetting from '../components/InputSetting';

const InputSettingImpl: React.FC<{redrawNowChartData: () => void, addParam: () => void,
	graphName: string, setGraphName: (value: string) => void}>
	= ({redrawNowChartData, addParam, graphName, setGraphName}) => {
	const [maxHp, setMaxHp] = React.useState(loadSettingInteger('maxHp', 35));
	const [armor, setArmor] = React.useState(loadSettingInteger('armor', 49));
	const [nowHp, setNowHp] = React.useState(loadSettingInteger('nowHp', 35));

	const setMaxHpFunc = (value: number) => {
		setMaxHp(value);
		saveSettingNumber('maxHp', value);
		redrawNowChartData();
	};
	
	const setArmorFunc = (value: number) => {
		setArmor(value);
		saveSettingNumber('armor', value);
		redrawNowChartData();
	};
	
	const setNowHpFunc = (value: number) => {
		setNowHp(value);
		saveSettingNumber('nowHp', value);
		redrawNowChartData();
	};
	
	const setGraphNameFunc = (nameValue: string) => {
		setGraphName(nameValue);
		saveSettingString('name', nameValue);
		redrawNowChartData();
	};

	const clickAddButton = () => {
		addParam();
	}

	return (<InputSetting initialMaxHp={maxHp} initialArmor={armor} initialNowHp={nowHp}
		graphName={graphName} maxHpMin={Math.max(1, nowHp)} nowHpMax={Math.min(200, maxHp)}
		setMaxHpFunc={setMaxHpFunc} setArmorFunc={setArmorFunc} setNowHpFunc={setNowHpFunc}
		setGraphNameFunc={setGraphNameFunc} onClickButton={clickAddButton}/>);
}

export default InputSettingImpl;
