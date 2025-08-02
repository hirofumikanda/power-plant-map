export function calculateAnnualPower(features: maplibregl.GeoJSONFeature[], capacityKey: string = "power", rate = 0.7): number {
  let total = features.reduce((sum, f) => {
    const power = parseFloat(f.properties?.[capacityKey]);
    return sum + (isNaN(power) ? 0 : power);
  }, 0);
  total *= 24 * 365 * rate;
  total /= 10000;
  return Math.round(total * 100) / 100;
}

export function filterFeaturesByStatus(features: maplibregl.GeoJSONFeature[], statuses: string[]) {
  return features.filter(f => statuses.includes(f.properties?.status));
}

export function getUniqueFeatures(features: maplibregl.GeoJSONFeature[]): maplibregl.GeoJSONFeature[] {
  const uniqueMap = new Map<number | string, maplibregl.GeoJSONFeature>();
  for (const feature of features) {
    const id = feature.properties?.id;
    if (id !== null && id !== undefined) {
      uniqueMap.set(id, feature);
    }
  }
  return Array.from(uniqueMap.values());
}

export function updateInfoBox({
  elementId,
  baseHtml,
  stats,
}: {
  elementId: string;
  baseHtml: string;
  stats: { label: string; count: number; value: number; color: string }[];
}) {
  const box = document.getElementById(elementId);
  if (!box) return;
  box.innerHTML = baseHtml;
  for (const stat of stats) {
    const percentage = (stat.value / 10000) * 100;
    box.innerHTML += `
      <br />
      <strong>${stat.label}（${stat.count}基）出力：</strong><br />
      <span style="font-size: 16px; color: ${stat.color};">
        ${stat.value.toLocaleString()} 億kWH（${percentage.toFixed(2)}%）
      </span><br />
    `;
  }
}