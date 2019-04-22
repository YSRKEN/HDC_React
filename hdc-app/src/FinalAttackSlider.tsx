import * as React from 'react';

interface ISliderProps {
	// 初期値
	initialValue: number;
	// 最小値
	min: number;
	// 最大値
	max: number;
}

const FinalAttackSlider: React.FC<ISliderProps> = ({initialValue, min, max}) => {
	/* スライダーの値 */
	const [value, changeValue] = React.useState(Math.max(Math.min(initialValue, max), min));

	/* スライダーを動かした際の動き */
	const onChangeSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
		const sliderValue = parseInt(e.target.value, 10);
		changeValue(sliderValue);
	};

	/**
	 * テキストを編集した際の動き
	 */
	const onChangeText = (e: React.FormEvent<HTMLInputElement>) => {
		if (typeof(e.currentTarget.value) === 'string') {
			const sliderValue = parseInt(e.currentTarget.value, 10);
			changeValue(sliderValue);
		}
	}

	return (
		<div className="d-flex my-1">
			<label className="text-nowrap mt-1">最終攻撃力</label>
			<input type="text" className="mx-2 px-1 col-2 col-md-1" value={"" + value} onChange={onChangeText} />
			<input type="range" className="custom-range mt-1" min={min} max={max} value={"" + value}
				onChange={onChangeSlider} />
		</div>
	);
};

export default FinalAttackSlider;
