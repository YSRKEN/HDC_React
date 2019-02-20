import * as React from 'react';

interface InputWithSliderProps {
	label: string;
	initialValue: number;
	min: number;
	max: number;
}

interface InputWithSliderState {
	value: number;
}

export default class InputWithSlider extends React.Component<InputWithSliderProps, InputWithSliderState> {
	constructor(props: InputWithSliderProps) {
		super(props);
		this.state = { value: this.props.initialValue };
		this.onChangeSlider = this.onChangeSlider.bind(this);
	}

	public render() {
		const { label, min, max } = this.props;
		return (
			<div className="d-flex">
				<label className="text-nowrap mt-1">{label}</label>
				<input type="text" className="mx-2 px-1 col-2 col-md-1" value={"" + this.state.value}/>
				<input type="range" className="custom-range mt-1" min={min} max={max} value={"" + this.state.value}
					onChange={this.onChangeSlider}/>
			</div>
		);
	}

	private onChangeSlider(e: React.ChangeEvent<HTMLInputElement>) {
		const sliderValue = parseInt(e.target.value, 10);
		this.setState({ value: sliderValue });
	}
}
