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
      zoom: 5,
      hash: true,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-left");

    map.on("load", async () => {
      const response = await map.loadImage("icon.png");
      map.addImage("icon", response.data);
      const features = map.querySourceFeatures("nuclear_power_plant", {
        sourceLayer: "nuclear_power_plant",
      });

      const runningFeatures = features.filter(
        (f) => f.properties?.status === "running"
      );

      let totalPower = runningFeatures.reduce((sum, f) => {
        const power = parseFloat(f.properties?.power);
        return sum + (isNaN(power) ? 0 : power);
      }, 0);
      totalPower *= 3600; // 万kwから万kwHに変換
      totalPower /= 10000; // 万kwHから億kwHに変換
      totalPower = Math.round(totalPower * 100) / 100; // 小数点以下2桁に丸める

      const percentage = (totalPower / 10000.0) * 100;

      const infoBox = document.getElementById("power-generation-info");
      if (infoBox) {
        infoBox.innerHTML = `
          <strong>稼働中の原発合計出力：</strong><br />
          <span style="font-size: 16px; color: #d33;">
            ${totalPower.toLocaleString()} 億kwH<br/>
            (${percentage.toFixed(2)}%)
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
