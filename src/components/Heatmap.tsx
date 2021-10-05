import React, { useRef, useMemo, useCallback, useState } from "react";

import AutoSizer from "react-virtualized-auto-sizer"; // v^1.0.5
import { Episode } from "../types";
import { nest } from "d3-collection";
import { max as d3Max, ascending, range } from "d3-array";
import { scaleThreshold, ScaleThreshold } from "d3";
// import useChartDimensions from "../hooks/useChartDimensions";
import { Flex, Box } from "@chakra-ui/react";

const COLOR_SCHEMES: Record<string, string[]> = {
  "1": ["#49525E", "#C92913", "#FFAA00", "#F5E033", "#7ECF4C"],
  "2": ["#C35E34", "#E7A876", "#F0EBD7", "#A6C2A4", "#448C82"],
  "3": ["#49525E", "#C92913", "#FFAA00", "#F5E033", "#7ECF4C"],
};

const HeatmapTitle = ({
  value,
  boxWidth,
  boxSpace,
  index,
  column,
  hover,
  contentId,
}: {
  value: string;
  boxWidth: number;
  boxSpace: number;
  index: number;
  column: boolean;
  hover: Episode | null;
  contentId: string;
}) => {
  const x = column ? (boxWidth + boxSpace) * index : 0;
  const y = column ? 0 : (boxWidth + boxSpace) * index;
  const boxSize = 4;
  const w = column ? boxWidth : boxSize;
  const h = column ? boxSize : boxWidth;
  const boxX = column ? 0 : boxWidth - boxSize;
  const boxY = column ? boxWidth - boxSize : 0;
  const fontSize = boxWidth / 1.6;
  const fontWeight =
    hover && hover[contentId as keyof Episode].toString() == value ? 700 : 200;
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* <rect width={w} height={h} x={boxX} y={boxY} fill="#A0AEC0"></rect> */}
      <text
        textAnchor="middle"
        x={boxWidth / 2}
        y={boxWidth / 2}
        style={{ color: "black", fontSize, fontWeight: fontWeight }}
        fill="black"
        dy="0.38em"
      >
        {value}
      </text>
    </g>
  );
};

const HeatmapCell = ({
  episode,
  boxWidth,
  boxSpace,
  colorScale,
  textScale,
  index,
  column,
  onHover,
}: {
  episode: Episode;
  boxWidth: number;
  boxSpace: number;
  index: number;
  colorScale: ScaleThreshold<number, string>;
  textScale: ScaleThreshold<number, string>;
  column: boolean;
  onHover: (hover: Episode | null) => void;
}) => {
  const fontSize = boxWidth / 1.8;
  const value = episode?.averageRating?.toFixed(1) || "";
  const x = column
    ? 0
    : (boxWidth + boxSpace) * (+episode.episodeNumber - 1 || index);
  const y = column
    ? (boxWidth + boxSpace) * (+episode.episodeNumber - 1 || index)
    : 0;
  const onClick = useCallback(() => {
    const url = `https://www.imdb.com/title/${episode.tconst}`;
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  }, []);

  const onHoverOn = useCallback(() => {
    onHover(episode);
  }, [episode]);
  const onHoverOff = useCallback(() => {
    onHover(null);
  }, []);
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect
        width={boxWidth}
        height={boxWidth}
        fill={
          episode.averageRating ? colorScale(episode.averageRating) : "#E2E8F0"
        }
        style={{ cursor: "pointer" }}
        onClick={onClick}
        onMouseEnter={onHoverOn}
        onMouseOut={onHoverOff}
      ></rect>
      <text
        textAnchor="middle"
        pointerEvents="none"
        x={boxWidth / 2}
        y={boxWidth / 2}
        style={{ color: "white", fontSize }}
        fill={
          episode.averageRating ? textScale(episode.averageRating) : "black"
        }
        dy="0.38em"
      >
        {value}
      </text>
    </g>
  );
};

const HeatmapColumn = ({
  episodes,
  boxWidth,
  boxSpace,
  index,
  colorScale,
  textScale,
  column,
  onHover,
}: {
  episodes: Episode[];
  boxWidth: number;
  boxSpace: number;
  index: number;
  colorScale: ScaleThreshold<number, string>;
  textScale: ScaleThreshold<number, string>;
  column: boolean;
  onHover: (hover: Episode | null) => void;
}) => {
  const x = column ? (boxWidth + boxSpace) * index : 0;
  const y = column ? 0 : (boxWidth + boxSpace) * index;
  return (
    <g transform={`translate(${x},${y})`}>
      {episodes.map((e, i) => (
        <HeatmapCell
          key={e.episodeNumber}
          episode={e}
          boxWidth={boxWidth}
          boxSpace={boxSpace}
          colorScale={colorScale}
          textScale={textScale}
          index={i}
          column={column}
          onHover={onHover}
        />
      ))}
    </g>
  );
};

type BySeasonRow = {
  key: string;
  values: Episode[];
};

type HeatmapProps = {
  bySeason: BySeasonRow[];
  episodes: Episode[];
  width: number;
  column: boolean;
  colorScale: ScaleThreshold<number, string>;
  textScale: ScaleThreshold<number, string>;
  onHover: (episode: Episode | null) => void;
  hover: Episode | null;
};

const Heatmap = ({
  bySeason,
  episodes,
  width: outerWidth,
  column,
  colorScale,
  textScale,
  hover,
  onHover,
}: HeatmapProps) => {
  const margin = useMemo(
    () => ({
      top: 30,
      right: 10,
      bottom: 20,
      left: 40,
    }),
    []
  );

  const onHoverCallback = useCallback(
    (episode: Episode | null) => onHover(episode),
    [onHover]
  );

  const xTitle = useMemo(() => (column ? "Season" : "Episode"), [column]);
  const yTitle = useMemo(() => (column ? "Episode" : "Season"), [column]);

  const seasonNames = useMemo(() => {
    return bySeason.map((h) => h.key);
  }, [bySeason]);

  const episodeNames = useMemo(() => {
    const maxEpisode = d3Max(episodes, (d) => d.episodeNumber as number);
    const episodeNames = range(1, (maxEpisode ?? 1) + 1).map((r) =>
      r.toString()
    );

    return episodeNames;
  }, [episodes]);

  const { boxWidth, boxSpace, width, height } = useMemo(() => {
    const boxSpace = 1;
    const maxHeight = 1600;
    // const maxEpisode = d3Max(bySeason, (d) => d.values.length) ?? 0;
    const maxEpisode = episodeNames.length;
    const maxSeason = bySeason.length;

    const maxRowCount = column ? maxEpisode : maxSeason;
    const maxColCount = column ? maxSeason : maxEpisode;
    const maxEntries = Math.max(maxRowCount, maxColCount);

    const maxDimension = Math.min(
      maxHeight - (margin.top + margin.bottom),
      outerWidth - (margin.left + margin.right)
    );

    const boxWidth =
      Math.min(Math.floor(maxDimension / (maxEntries + 1)), 40) - boxSpace;
    const innerHeight = (boxWidth + boxSpace) * (maxRowCount + 1);
    const height = innerHeight + margin.top + margin.bottom;

    const innerWidth = (boxWidth + boxSpace) * (maxColCount + 1);
    const width = innerWidth + margin.left + margin.right;
    return { boxWidth, boxSpace, innerHeight, height, width };
  }, [bySeason, episodeNames, margin, outerWidth, column]);

  const topRowId = useMemo(
    () => (column ? "episodeNumber" : "seasonNumber"),
    [column]
  );
  const sideColumnId = useMemo(
    () => (column ? "seasonNumber" : "episodeNumber"),
    [column]
  );

  const sideColumnContent = useMemo(
    () => (column ? seasonNames : episodeNames),
    [column]
  );
  const topRowContent = useMemo(
    () => (column ? episodeNames : seasonNames),
    [column]
  );

  return (
    <Flex width={outerWidth} justify="center">
      <svg height={height} width={width} style={{ overflow: "visible" }}>
        <g transform={`translate(${0},${0})`}>
          <text
            x={width / 2 + margin.left}
            dy="0.29em"
            y={0}
            textAnchor={"middle"}
            transform={`translate(${0},${margin.top / 2})`}
            style={{ fontWeight: 200, fontSize: boxWidth / 1.4 }}
          >
            {xTitle}
          </text>
          <text
            x={margin.left / 2}
            dy="0.29em"
            y={height / 2 + margin.top}
            textAnchor={"middle"}
            // transform={`translate(${0},${margin.top / 2})`}
            dominantBaseline="central"
            transform={`rotate(${-90}, ${margin.left / 3}, ${
              height / 2 + margin.top
            })`}
            style={{ fontWeight: 200, fontSize: boxWidth / 1.4 }}
          >
            {yTitle}
          </text>
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            <g transform={`translate(${boxWidth}, ${0})`}>
              {sideColumnContent.map((s, i) => (
                <HeatmapTitle
                  key={s}
                  value={s}
                  index={i}
                  boxWidth={boxWidth}
                  boxSpace={boxSpace}
                  column={true}
                  hover={hover}
                  contentId={sideColumnId}
                />
              ))}
            </g>
            <g transform={`translate(${0}, ${boxWidth})`}>
              {topRowContent.map((s: string, i: number) => (
                <HeatmapTitle
                  key={s}
                  value={s}
                  index={i}
                  boxWidth={boxWidth}
                  boxSpace={boxSpace}
                  column={false}
                  hover={hover}
                  contentId={topRowId}
                />
              ))}
            </g>
            <g
              className="marks"
              transform={`translate(${boxWidth + boxSpace}, ${
                boxWidth + boxSpace
              })`}
            >
              {bySeason.map((season, index) => (
                <HeatmapColumn
                  key={season.key}
                  index={index}
                  episodes={season.values}
                  boxWidth={boxWidth}
                  boxSpace={boxSpace}
                  colorScale={colorScale}
                  textScale={textScale}
                  column={column}
                  onHover={onHover}
                />
              ))}
            </g>
          </g>
        </g>
      </svg>
    </Flex>
  );
};

const AutoSizedHeatmap = (props: Omit<HeatmapProps, "width">) => {
  return (
    <AutoSizer disableWidth={false} disableHeight={true}>
      {({ width, height }) => <Heatmap width={width} {...props} />}
    </AutoSizer>
  );
};

export default AutoSizedHeatmap;
