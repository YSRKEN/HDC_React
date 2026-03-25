import * as React from 'react';
import {
	Chart as ChartJS,
	ChartData,
	ChartOptions,
	Legend,
	LineElement,
	LinearScale,
	PointElement,
	Tooltip
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';

ChartJS.register(Legend, LineElement, LinearScale, PointElement, Tooltip);

interface IGraphPoint {
	x: number;
	y: number;
}

type ScatterChartData = ChartData<'scatter', IGraphPoint[], number>;

const OutputGraph: React.FC<{graphData: ScatterChartData, setIgnoreNames: (value: string[]) => void}>
	= ({graphData, setIgnoreNames}) => {
	const options = React.useMemo<ChartOptions<'scatter'>>(() => ({
		elements: { line: { tension: 0 } },
		scales: {
			x: { title: { display: true, text: '最終攻撃力' } },
			y: { title: { display: true, text: '大破率(％)' } }
		},
		plugins: {
			legend: {
				onClick: (_event, legendItem, legend) => {
					const datasetIndex = legendItem.datasetIndex;
					if (typeof datasetIndex !== 'number') {
						return;
					}
					const chart = legend.chart;
					chart.setDatasetVisibility(datasetIndex, !chart.isDatasetVisible(datasetIndex));
					chart.update();
					const ignoreNames = legend.chart.data.datasets
						.map((dataset, index) => ({
							hidden: !legend.chart.isDatasetVisible(index),
							name: dataset.label ?? ''
						}))
						.filter(item => item.hidden)
						.map(item => item.name);
					setIgnoreNames(ignoreNames);
				}
			}
		}
	}), [setIgnoreNames]);

	return (
		<Scatter width={450} height={450} data={graphData} options={options} />
	);
}

export default OutputGraph
