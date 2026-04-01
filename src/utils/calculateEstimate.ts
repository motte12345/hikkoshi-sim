import {
  type LayoutType,
  type VolumeType,
  type DayType,
  type TimeSlot,
  basePriceByLayout,
  distanceSurcharges,
  seasonMultipliers,
  dayTypeMultipliers,
  timeSlotMultipliers,
  options as optionItems,
  RANGE_FACTOR,
} from '../data/priceTable';

export interface EstimateInput {
  readonly layout: LayoutType;
  readonly volume: VolumeType;
  readonly distanceKm: number;
  readonly month: number;
  readonly dayType: DayType;
  readonly timeSlot: TimeSlot;
  readonly selectedOptionIds: readonly string[];
}

export interface EstimateBreakdown {
  readonly basePrice: number;
  readonly distanceSurcharge: number;
  readonly distanceLabel: string;
  readonly seasonMultiplier: number;
  readonly seasonLabel: string;
  readonly dayMultiplier: number;
  readonly dayLabel: string;
  readonly timeMultiplier: number;
  readonly timeLabel: string;
  readonly optionsCost: number;
  readonly optionsDetail: readonly { name: string; price: number }[];
  readonly subtotal: number;
  readonly totalMin: number;
  readonly totalMax: number;
}

export function calculateEstimate(input: EstimateInput): EstimateBreakdown {
  const basePrice = basePriceByLayout[input.layout][input.volume];

  // 距離加算
  const distanceEntry = distanceSurcharges.find(d => input.distanceKm <= d.maxKm)
    ?? distanceSurcharges[distanceSurcharges.length - 1];
  const distanceSurcharge = distanceEntry.price;
  const distanceLabel = distanceEntry.label;

  // 時期係数
  const season = seasonMultipliers[input.month];
  const seasonMultiplier = season.multiplier;
  const seasonLabel = `${input.month}月（${season.label}）`;

  // 曜日係数
  const day = dayTypeMultipliers[input.dayType];
  const dayMultiplier = day.multiplier;
  const dayLabel = day.label;

  // 時間帯係数
  const time = timeSlotMultipliers[input.timeSlot];
  const timeMultiplier = time.multiplier;
  const timeLabel = time.label;

  // オプション
  const optionsDetail = input.selectedOptionIds
    .map(id => optionItems.find(o => o.id === id))
    .filter((o): o is typeof optionItems[number] => o !== undefined)
    .map(o => ({ name: o.name, price: o.price }));
  const optionsCost = optionsDetail.reduce((sum, o) => sum + o.price, 0);

  // 小計 = (基本料金 + 距離加算) × 時期係数 × 曜日係数 × 時間帯係数 + オプション
  const subtotal = Math.round(
    (basePrice + distanceSurcharge) * seasonMultiplier * dayMultiplier * timeMultiplier
    + optionsCost
  );

  const totalMin = Math.round(subtotal * (1 - RANGE_FACTOR));
  const totalMax = Math.round(subtotal * (1 + RANGE_FACTOR));

  return {
    basePrice,
    distanceSurcharge,
    distanceLabel,
    seasonMultiplier,
    seasonLabel,
    dayMultiplier,
    dayLabel,
    timeMultiplier,
    timeLabel,
    optionsCost,
    optionsDetail,
    subtotal,
    totalMin,
    totalMax,
  };
}
