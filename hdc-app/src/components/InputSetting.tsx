import * as React from 'react';
import { Button, Form } from 'react-bootstrap';
import InputWithSlider from './InputWithSlider';

/**
 * 設定を入力するためのProps
 */
interface InputSettingProps {
	// 最大耐久
	initialMaxHp: number;
	// 装甲
	initialArmor: number;
	// 現在の耐久
	initialNowHp: number;
	// 設定名
	graphName: string;
	// 最大耐久の最小値
	maxHpMin: number;
	// 現在耐久の最大値
	nowHpMax: number;
	// 最大耐久を変更した際の処理
	setMaxHpFunc: (value: number) => void;
	// 装甲を変更した際の処理
	setArmorFunc: (value: number) => void;
	// 現在の耐久を変更した際の処理
	setNowHpFunc: (value: number) => void;
	// 設定名を変更した際の処理
	setGraphNameFunc: (value: string) => void;
	// 追加ボタンを押した際の処理
	onClickButton: () => void;
}

const InputSetting: React.FC<InputSettingProps>
	= ({ initialArmor, initialMaxHp, initialNowHp, graphName, maxHpMin, nowHpMax,
		setArmorFunc, setMaxHpFunc, setNowHpFunc, setGraphNameFunc, onClickButton }) => {
	
	/* 設定名を変更した際の動き */
	const onChangeName = (e: React.ChangeEvent<any>) => {
		const nameValue = e.target.value;
		if (typeof (nameValue) !== 'string') {
			return;
		}
		setGraphNameFunc(nameValue);
	}

	return (
		<Form className="border p-3">
			<Form.Group controlId="param">
				<InputWithSlider label="最大耐久" min={maxHpMin} max={200} initialValue={initialMaxHp} setValue={setMaxHpFunc} />
				<InputWithSlider label="艦娘装甲" min={0} max={200} initialValue={initialArmor} setValue={setArmorFunc} />
				<InputWithSlider label="現在耐久" min={1} max={nowHpMax} initialValue={initialNowHp} setValue={setNowHpFunc} />
				<div className="d-flex my-1">
					<Form.Label className="mr-3 text-nowrap mt-2">設定名</Form.Label>
					<Form.Control type='text' value={graphName} onChange={onChangeName} />
				</div>
			</Form.Group>
			<Button type="button" className="w-100" onClick={onClickButton}>追加</Button>
		</Form>
	);
};

export default InputSetting;
