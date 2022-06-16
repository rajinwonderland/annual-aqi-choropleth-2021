import React, { useState, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import { csv } from "d3-fetch";
const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json";

const MapChart = ({ setTooltipContent }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // https://www.bls.gov/lau/
    csv("/2021_latest_aqi.csv").then((counties) => {
      setData(counties);
    });
  }, []);

  const colors = [
    "rgb(0, 228, 0)",
    "yellow",
    "rgb(255, 126, 0)",
    "#ef4444",
    "rgb(143, 63, 151)",
    "rgb(126, 0, 35)"
  ];

  const colorScale = scaleLinear()
    .domain([0, 51, 101, 151, 201, 300])
    .range(colors);

  return (
    <ComposableMap projection="geoAlbersUsa" data-tip="">
      <ZoomableGroup>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const cur = data.find((s) => s.geoid === geo.id);
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => {
                    const { name } = geo.properties;
                    setTooltipContent(`${name} — ${cur.ninety_percentile}`);
                  }}
                  onMouseLeave={() => {
                    setTooltipContent("");
                  }}
                  style={{
                    default: {
                      outline: "none"
                    },
                    hover: {
                      outline: "none",
                      stroke: "black"
                    },
                    pressed: {
                      outline: "none",
                      stroke: "black"
                    }
                  }}
                  fill={cur ? colorScale(cur.ninety_percentile) : "#EEE"}
                />
              );
            })
          }
        </Geographies>
      </ZoomableGroup>
    </ComposableMap>
  );
};

export default MapChart;
