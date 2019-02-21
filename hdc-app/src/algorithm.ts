// 装甲乱数における最小値と範囲と最大値の倍率(％)
const MIN_ARMOR_PER = 70;
const RANGE_ARMOR_PER = 60;

// カスダメにおける最小値と範囲の倍率(％)
const MIN_VERY_LIGHT_PER = 6;
const RANGE_VERY_LIGHT_PER = 8;

// 轟沈ストッパーにおける最小値と範囲の倍率(％)
const MIN_STOPPER_PER = 50;
const RANGE_STOPPER_PER = 30;

// 2次元座標を表現するためのinterface
interface IPoint {
  x: number;
  y: number;
}

// カスダメ時の大破率を算出する
const calcVerylightDamageProb = (nowHp: number, heavyDamageHp: number) => {
  // 大破した回数をカウントする
  let count = 0;
  for (let hi = 0; hi < nowHp; ++hi) {
    // カスダメ時のダメージ
    const damage = Math.floor((MIN_VERY_LIGHT_PER * nowHp + RANGE_VERY_LIGHT_PER * hi) / 100.0);

    // カスダメ時の残耐久
    const leaveHp = nowHp - damage;

    // 大破判定
    if (leaveHp <= heavyDamageHp) {
      ++count;
    }
  }

  // カウントから大破率を計算する
  return 1.0 * count / nowHp;
}

// 轟沈ストッパー時の大破率を算出する
const calcStopperDamageProb = (nowHp: number, heavyDamageHp: number) => {
  // 大破した回数をカウントする
  let count = 0;
  for (let hi = 0; hi < nowHp; ++hi) {
    // 轟沈ストッパー時のダメージ
    const damage = Math.floor((MIN_STOPPER_PER * nowHp + RANGE_STOPPER_PER * hi) / 100.0);

    // 轟沈ストッパー時の残耐久
    const leaveHp = nowHp - damage;

    // 大破判定
    if (leaveHp <= heavyDamageHp) {
      ++count;
    }
  }

  // カウントから大破率を計算する
  return 1.0 * count / nowHp;
}

// プロット用データを計算する
export const calcPlotData = (maxHp: number, armor: number, nowHp: number) => {
  // 確実にカスダメとなる最大の最終攻撃力
  const maxVeryLightPower = Math.ceil(armor * MIN_ARMOR_PER / 100.0);

  // 確実に轟沈ストッパーが掛かる最小の最終攻撃力
  const minStopperPower = nowHp + Math.ceil((armor * MIN_ARMOR_PER + (armor - 1) * RANGE_ARMOR_PER) / 100.0);

  // 大破判定を受ける最大の耐久値
  const heavyDamageHp = Math.floor(maxHp / 4);

  // カスダメ時の大破率
  const verylightProb = calcVerylightDamageProb(nowHp, heavyDamageHp);

  // 轟沈ストッパー時の大破率
  const stopperProb = calcStopperDamageProb(nowHp, heavyDamageHp);

  // 最終攻撃力がmaxVeryLightPowerの場合から順に計算していく
  const output: IPoint[] = [];
  for (let power = maxVeryLightPower; power <= minStopperPower; ++power) {
    // 最終攻撃力=powerの際の大破率
    let heavyDamageProbSum = 0.0;

    // 装甲乱数の計算
    for (let ai = 0; ai < armor; ++ai) {
      const armorRandom = MIN_ARMOR_PER * armor + RANGE_ARMOR_PER * ai;

      // カスダメか？
      const damage = Math.floor(power - armorRandom / 100.0);
      if (damage <= 0.0) {
        heavyDamageProbSum += verylightProb;
        continue;
      }

      // 轟沈ストッパーか？
      const leaveHp = nowHp - damage;
      if (leaveHp <= 0) {
        heavyDamageProbSum += stopperProb;
        continue;
      }

      // 通常のダメージ処理
      if (leaveHp <= heavyDamageHp) {
        heavyDamageProbSum += 1.0;
      }
    }

    // データを追加
    const heavyDamageProb = heavyDamageProbSum / armor;
    output.push({ x: power, y: heavyDamageProb * 100 });
  }
  return output;
}
