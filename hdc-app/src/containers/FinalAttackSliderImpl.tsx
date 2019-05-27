import * as React from 'react';
import FinalAttackSlider from '../components/FinalAttackSlider'

// tslint:disable-next-line: interface-name
interface SliderProps {
	// 最小値
	min: number;
	// 最大値
	max: number;
	// カーソルの値からログテキストを生成する
	calcLogText: (value: number) => string;
}

const FinalAttackSliderImpl: React.FC<SliderProps> = ({min, max, calcLogText}) => {
	const [finalAttack, setFinalAttack] = React.useState(50);
	const [cursorLog, setCursorLog] = React.useState('');

	/**
	 * finalAttackを変更する際の処理
	 * @param value 新しい値
	 */
	const setValueFunc2 = (value: number) => {
		setFinalAttack(value);
		setCursorLog(calcLogText(value));
	}

	return (<FinalAttackSlider value={finalAttack} min={min} max={max} setValueFunc={setValueFunc2} cursorLog={cursorLog}/>);
};

export default FinalAttackSliderImpl;
