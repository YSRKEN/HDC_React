import * as Chart from 'chart.js';
import * as React from 'react';
import { Scatter } from 'react-chartjs-2';

const OutputGraph: React.FC<{graphData: Chart.ChartData, setIgnoreNames: (value: string[]) => void}>
	= ({graphData, setIgnoreNames}) => {
	const scatterElement = React.useRef<Scatter>(null);

	const onClickGraph = () => {
		const scatterObject = scatterElement.current;
		if (scatterObject == null) {
			return;
		}
		const temp: any = scatterObject.chartInstance;
		const legendItems: Array<{text: string, hidden: boolean}> = temp.legend.legendItems;
		const ignoreNames = legendItems.filter(item => item.hidden).map(item => item.text);
		setIgnoreNames(ignoreNames);
	};

	return (
		<Scatter width={450} height={450} data={graphData}
		ref={scatterElement} onElementsClick={onClickGraph}
		options={{
			elements: { line: { tension: 0 } },
			scales: {
				xAxes: [{ scaleLabel: { display: true, labelString: '最終攻撃力' }, }],
				yAxes: [{ scaleLabel: { display: true, labelString: '大破率(％)' }, }]
			},
			showLines: true
		}} />
	);
}

export default OutputGraph
