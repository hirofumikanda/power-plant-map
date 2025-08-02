import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Protocol } from "pmtiles";
import { setupPopupHandler } from "../utils/popup";

const MapView = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const protocol = new Protocol();
    maplibregl.addProtocol("pmtiles", protocol.tile);

    const map = new maplibregl.Map({
      container: mapContainerRef.current!,
      style: "styles/style.json",
      center: [139.21, 37.18],
      zoom: 4,
      minZoom: 4,
      hash: true,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-left");

    map.on("load", async () => {
      const response = await map.loadImage("img/icon.png");
      map.addImage("icon", response.data);

      const infoBox = document.getElementById("power-generation-info");
      if (infoBox) {
        infoBox.innerHTML = `
          <span style="font-size: 16px;">年間発電量(稼働率70%の場合)</span><br />
          <span style="font-size: 10px;">※()内は全体の年間電力量1兆kWHに対する割合</span><br /><br />
        `;
      }
      const features = map.querySourceFeatures("nuclear_power_plant", {
        sourceLayer: "nuclear_power_plant",
      });

      const uniqueFeaturesMap = new Map<
        number | string,
        maplibregl.GeoJSONFeature
      >();

      for (const feature of features) {
        if (feature.properties.id !== null && feature.properties.id !== undefined) {
          uniqueFeaturesMap.set(feature.properties.id, feature);
        }
      }

      const uniqueFeatures = Array.from(uniqueFeaturesMap.values());

      const runningFeatures = uniqueFeatures.filter(
        (f) => f.properties?.status === "running"
      );

      let totalRunningPower = runningFeatures.reduce((sum, f) => {
        const power = parseFloat(f.properties?.power);
        return sum + (isNaN(power) ? 0 : power);
      }, 0);
      totalRunningPower *= 24 * 365 * 0.7; // 年間の万kWHに変換
      totalRunningPower /= 10000; // 万kWHから億kWHに変換
      totalRunningPower = Math.round(totalRunningPower * 100) / 100; // 小数点以下2桁に丸める

      const percentage = (totalRunningPower / 10000.0) * 100;

      if (infoBox) {
        infoBox.innerHTML += `
          <strong>稼働中の原発(${
            runningFeatures.length
          }基)合計出力：</strong><br />
          <span style="font-size: 16px; color: #d33;">
            ${totalRunningPower.toLocaleString()} 億kWH(${percentage.toFixed(
          2
        )}%)
          </span><br />
        `;
      }

      const passedFeatures = uniqueFeatures.filter((f) =>
        ["running", "passed"].includes(f.properties?.status)
      );

      let totalPassedPower = passedFeatures.reduce((sum, f) => {
        const power = parseFloat(f.properties?.power);
        return sum + (isNaN(power) ? 0 : power);
      }, 0);
      totalPassedPower *= 24 * 365 * 0.7; // 年間の万kWHに変換
      totalPassedPower /= 10000; // 万kWHから億kWHに変換
      totalPassedPower = Math.round(totalPassedPower * 100) / 100; // 小数点以下2桁に丸める

      const passedPercentage = (totalPassedPower / 10000.0) * 100;

      if (infoBox) {
        infoBox.innerHTML += `
          <br />
          <strong>+審査合格の原発合計(${
            passedFeatures.length - runningFeatures.length
          }基)出力：</strong><br />
          <span style="font-size: 16px; color: #33d;">
            ${totalPassedPower.toLocaleString()} 億kWH(${passedPercentage.toFixed(
          2
        )}%)
          </span><br />
        `;
      }

      const reviewingFeatures = uniqueFeatures.filter((f) =>
        ["running", "passed", "reviewing"].includes(f.properties?.status)
      );

      let totalReviewingPower = reviewingFeatures.reduce((sum, f) => {
        const power = parseFloat(f.properties?.power);
        return sum + (isNaN(power) ? 0 : power);
      }, 0);
      totalReviewingPower *= 24 * 365 * 0.7; // 年間の万kWHに変換
      totalReviewingPower /= 10000; // 万kWHから億kWHに変換
      totalReviewingPower = Math.round(totalReviewingPower * 100) / 100; // 小数点以下2桁に丸める

      const reviewingPercentage = (totalReviewingPower / 10000.0) * 100;

      if (infoBox) {
        infoBox.innerHTML += `
          <br />
          <strong>+審査中の原発合計(${
            reviewingFeatures.length - passedFeatures.length
          }基)出力：</strong><br />
          <span style="font-size: 16px; color: #888888;">
            ${totalReviewingPower.toLocaleString()} 億kWH(${reviewingPercentage.toFixed(
          2
        )}%)
          </span>
        `;
      }
    });

    setupPopupHandler(map);

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div ref={mapContainerRef} style={{ width: "100%", height: "100vh" }} />
  );
};

export default MapView;
