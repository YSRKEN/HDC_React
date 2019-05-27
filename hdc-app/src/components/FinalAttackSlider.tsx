import * as React from 'react';

// tslint:disable-next-line: interface-name
interface SliderProps {
	// スライダーの値
	value: number;
	// 最小値
	min: number;
	// 最大値
	max: number;
	// 設定値を変更した際の処理
	setValueFunc: (value: number) => void;
	// ログテキスト
	cursorLog: string;
}

const FinalAttackSlider: React.FC<SliderProps> = ({value, min, max, setValueFunc, cursorLog}) => {
	/* スライダーを動かした際の動き */
	const onChangeSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
		const sliderValue = parseInt(e.target.value, 10);
		setValueFunc(sliderValue);
	};

	/**
	 * テキストを編集した際の動き
	 */
	const onChangeText = (e: React.FormEvent<HTMLInputElement>) => {
		if (typeof(e.currentTarget.value) !== 'string') {
			return;
		}
		const sliderValue = parseInt(e.currentTarget.value, 10);
		setValueFunc(sliderValue);
	}

	return (
		<>
			<div className="d-flex my-1">
				<label className="text-nowrap mt-1">最終攻撃力</label>
				<input type="text" className="mx-2 px-1 col-2 col-md-1" value={value.toString()} onChange={onChangeText} />
				<input type="range" className="custom-range mt-1" min={min} max={max} value={value.toString()}
					onChange={onChangeSlider} />
			</div>
			<pre className='border p-3'>{cursorLog}</pre>
		</>
	);
};

export default FinalAttackSlider;
