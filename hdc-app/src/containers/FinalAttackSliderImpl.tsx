import * as React from 'react';
import FinalAttackSlider from '../components/FinalAttackSlider'

// tslint:disable-next-line: interface-name
interface SliderProps {
	// 最小値
	min: number;
	// 最大値
	max: number;
	//
	finalAttack: number;
	//
	setFinalAttack: (value: number) => void
	//
	cursorLog: string
}

const FinalAttackSliderImpl: React.FC<SliderProps> = ({min, max, finalAttack, setFinalAttack, cursorLog}) => {
	/**
	 * finalAttackを変更する際の処理
	 * @param value 新しい値
	 */
	const setValueFunc2 = (value: number) => {
		setFinalAttack(value);
	}

	return (<FinalAttackSlider value={finalAttack} min={min} max={max} setValueFunc={setValueFunc2} cursorLog={cursorLog}/>);
};

export default FinalAttackSliderImpl;
