import { calcMinStopperPower, calcPlotData } from './algorithm';

describe('calcMinStopperPower', () => {
  it('装甲49・現在耐久35の最小ストッパー攻撃力を返す', () => {
    expect(calcMinStopperPower(49, 35)).toBe(99);
  });

  it('現在耐久が1増えると必要攻撃力も1増える', () => {
    const base = calcMinStopperPower(49, 35);
    expect(calcMinStopperPower(49, 36)).toBe(base + 1);
  });
});

describe('calcPlotData', () => {
  it('右端を指定した場合は指定範囲のプロットを返す', () => {
    const result = calcPlotData(35, 49, 35, 40);
    expect(result[0].x).toBe(35);
    expect(result[result.length - 1].x).toBe(40);
    expect(result).toHaveLength(6);
  });

  it('確率値を0〜100%の範囲に収める', () => {
    const result = calcPlotData(35, 49, 35, 45);
    for (const point of result) {
      expect(point.y).toBeGreaterThanOrEqual(0);
      expect(point.y).toBeLessThanOrEqual(100);
    }
  });

  it('右端未指定時は最小ストッパー攻撃力まで計算する', () => {
    const minStopperPower = calcMinStopperPower(49, 35);
    const result = calcPlotData(35, 49, 35);
    expect(result[result.length - 1].x).toBe(minStopperPower);
  });
});
