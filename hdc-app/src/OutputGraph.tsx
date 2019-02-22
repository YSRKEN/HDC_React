import * as Chart from 'chart.js';
import * as React from 'react';
import { Scatter } from 'react-chartjs-2';
import { calcMinStopperPower, calcPlotData } from './algorithm';
import { IGraphParam } from './App';

const CHART_COLORS = [
	"#FF4B00",
	"#FFF100",
	"#03AF7A",
	"#005AFF",
	"#4DC4FF",
	"#FF8082",
	"#F6AA00",
	"#990099",
	"#804000",
];

const OutputGraph: React.FC<{params: IGraphParam[]}> = ({params}) => {
	const scatterElement = React.useRef<Scatter>(null);

	const createGraphData = (ignoreNames?: string[]) => {
		const ignoreNames2 = ignoreNames === undefined ? [] : ignoreNames;
		let rightXValue = 200;
		if (ignoreNames2.length !== params.length) {
			rightXValue = Math.max(...params
				.filter(param => !ignoreNames2.includes(param.name))
				.map(param => calcMinStopperPower(param.armor, param.nowHp)));
		}
		return {
			datasets: params.map((param, i) => ({
				backgroundColor: Chart.helpers.color(CHART_COLORS[i]).alpha(0.2).rgbString(),
				borderColor: CHART_COLORS[i],
				data: calcPlotData(param.maxHp, param.armor, param.nowHp, rightXValue + 10),
				fill: false,
				label: param.name,
				pointRadius: 0
			}))
		};
	};

	const [graphData, setGraphData] = React.useState(createGraphData());

	const onClickGraph = () => {
		const scatterObject = scatterElement.current;
		if (scatterObject == null) {
			return;
		}
		const temp: any = scatterObject.chartInstance;
		const legendItems: Array<{text: string, hidden: boolean}> = temp.legend.legendItems;
		const ignoreNames = legendItems.filter(item => item.hidden).map(item => item.text);
		setGraphData(createGraphData(ignoreNames));
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
