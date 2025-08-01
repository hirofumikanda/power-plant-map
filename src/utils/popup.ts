import maplibregl, { Map, MapMouseEvent } from "maplibre-gl";
import type { MapGeoJSONFeature } from "maplibre-gl";

export const setupPopupHandler = (map: Map) => {
  map.on("click", (e: MapMouseEvent) => {
    const features = map.queryRenderedFeatures(e.point);

    if (features.length === 0) return;

    const popupContent = buildPopupContent(features[0]);
    new maplibregl.Popup({ closeOnClick: true })
      .setLngLat(e.lngLat)
      .setHTML(popupContent)
      .addTo(map);
  });
};

const buildPopupContent = (feature: MapGeoJSONFeature): string => {
  const props = feature.properties ?? {};
  let html = `<table style="border-collapse:collapse;">`;

  for (const key in props) {
    let value = props[key];
    if (
      !(
        key == "name" ||
        key == "power" ||
        key == "unit" ||
        key == "status" ||
        key == "reactor_type"
      )
    )
      continue;
    if (key == "power") value = `${value} 万kW`;
    if (key == "unit") value = `${value} 号機`;
    if (key == "reactor_type") {
      if (value === 1) {
        value = "GCR（ガス冷却炉）";
      } else if (value === 2) {
        value = "BWR（沸騰水型軽水炉）";
      } else if (value === 3) {
        value = "PWR（加圧水型軽水炉）";
      } else if (value === 4) {
        value = "ABWR（改良型沸騰水型軽水炉）";
      } else if (value === 5) {
        value = "ATR（新型転換炉）";
      } else if (value === 6) {
        value = "FBR（高速増殖炉）";
      } else if (value === 7) {
        value = "APWR（改良型加圧水型軽水炉）";
      }
    }
    if (key == "status") {
      if (value === "running") {
        value = "再稼働";
      } else if (value === "pass") {
        value = "安全審査合格";
      } else if (value === "fail") {
        value = "安全審査不合格";
      } else if (value === "reviewed") {
        value = "審査中";
      } else {
        value = "廃炉または未申請";
      }
    }
    if (Object.prototype.hasOwnProperty.call(props, key)) {
      html += `
        <tr>
          <td style="padding:4px; border:1px solid #ccc;"><strong>${escapeHTML(
            key
          )}</strong></td>
          <td style="padding:4px; border:1px solid #ccc;">${escapeHTML(
            String(value)
          )}</td>
        </tr>`;
    }
  }

  html += `</table>`;
  return html;
};

const escapeHTML = (str: string): string =>
  str.replace(/[&<>"']/g, (char) => {
    const map: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return map[char];
  });
