import maplibregl from "maplibre-gl";
import {
  getUniqueFeatures,
  filterFeaturesByStatus,
  calculateAnnualPower,
  updateInfoBox,
} from "./mapUtils";

export async function onMapLoad(map: maplibregl.Map) {
  const response = await map.loadImage("img/icon.png");
  map.addImage("icon", response.data);

  const rawFeatures = map.querySourceFeatures("nuclear_power_plant", {
    sourceLayer: "nuclear_power_plant",
  });

  const uniqueFeatures = getUniqueFeatures(rawFeatures);

  const running = filterFeaturesByStatus(uniqueFeatures, ["running"]);
  const passed = filterFeaturesByStatus(uniqueFeatures, ["running", "passed"]);
  const reviewing = filterFeaturesByStatus(uniqueFeatures, [
    "running",
    "passed",
    "reviewing",
  ]);

  const stats = [
    {
      label: "稼働中の原発",
      count: running.length,
      value: calculateAnnualPower(running),
      color: "#d33",
    },
    {
      label: "+審査合格の原発合計",
      count: passed.length - running.length,
      value: calculateAnnualPower(passed),
      color: "#33d",
    },
    {
      label: "+審査中の原発合計",
      count: reviewing.length - passed.length,
      value: calculateAnnualPower(reviewing),
      color: "#888888",
    },
  ];

  updateInfoBox({
    elementId: "power-generation-info",
    baseHtml: `
      <span style="font-size: 16px;">年間発電量(稼働率70%の場合)</span><br />
      <span style="font-size: 10px;">※()内は全体の年間電力量1兆kWHに対する割合</span><br />
    `,
    stats,
  });
}
