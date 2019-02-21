import * as Chart from 'chart.js';
import * as React from 'react';
import { Scatter } from 'react-chartjs-2';
import { calcPlotData } from './algorithm';

const CHART_COLORS = {
	blue: "#00FF00",
	red: "#FF0000"
};

/**
 * Graphを表示するためのProps
 */
interface IOutputGraphProps {
	// 装甲
	armor: number;
	// 最大耐久
	maxHp: number;
	// 設定名
	name: string;
	// 現在の耐久
	nowHp: number;
}

const OutputGraph: React.FC<IOutputGraphProps> = ({armor, maxHp, name, nowHp}) => {
	const createGraphData = () => {
		const plotData = calcPlotData(maxHp, armor, nowHp);
		return {
		  datasets: [{
			backgroundColor: Chart.helpers.color(CHART_COLORS.red).alpha(0.2).rgbString(),
			borderColor: CHART_COLORS.red,
			data: plotData,
			label: name
		  }]
		};
	  }

	return (
		<Scatter width={450} height={450} data={createGraphData} options={{
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
