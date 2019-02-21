import * as React from 'react';

/**
 * スライダーの設定を書くためのProps
 */
interface InputWithSliderProps {
	// 表示ラベルの文字列
	label: string;
	// 初期値
	initialValue: number;
	// 最小値
	min: number;
	// 最大値
	max: number;
}

/**
 * 自作スライダー
 */
const InputWithSlider: React.SFC<InputWithSliderProps> = ({label, initialValue, min, max}) => {
	/* スライダーの値 */
	const [value, changeValue] = React.useState(initialValue);

	/* スライダーを動かした際の動き */
	const onChangeSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
		const sliderValue = parseInt(e.target.value, 10);
		changeValue(sliderValue);
	};

	return (
		<div className="d-flex my-1">
			<label className="text-nowrap mt-1">{label}</label>
			<input type="text" className="mx-2 px-1 col-2 col-md-1" value={"" + value} readOnly={true}/>
			<input type="range" className="custom-range mt-1" min={min} max={max} value={"" + value}
				onChange={onChangeSlider}/>
		</div>
	);
};

export default InputWithSlider
