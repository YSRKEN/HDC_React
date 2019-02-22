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
	const createGraphData = () => {
		const rightXValue = Math.max(...params.map(param => calcMinStopperPower(param.armor, param.nowHp)));
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

	return (
		<Scatter width={450} height={450} data={createGraphData}
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
