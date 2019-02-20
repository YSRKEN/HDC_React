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
	}

	public render() {
		const { label, initialValue, min, max } = this.props;
		return (<span>{label} {min}-{initialValue}-{max}</span>);
	}
}
