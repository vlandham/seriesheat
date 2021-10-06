import React, { useMemo, useCallback, useState } from "react";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { nest } from "d3-collection";
import { ascending } from "d3-array";
import { scaleThreshold, ScaleThreshold } from "d3-scale";

import { isNumeric } from "../utils/dataUtils";

import { Series, Episode } from "../types";
import AutoSizedHeatmap from "./Heatmap";
import ImdbLogo from "./ImdbLogo";

const COLOR_SCHEMES: Record<string, string[]> = {
  "1": ["#49525E", "#C92913", "#FFAA00", "#F5E033", "#7ECF4C"],
  // "2": ["#C35E34", "#E7A876", "#F0EBD7", "#A6C2A4", "#448C82"],
  "2": [
    "#d53e4f",
    "#f46d43",
    "#fdae61",
    "#fee08b",
    "#abdda4",
    "#66c2a5",
    "#3288bd",
  ],
  "2f": [
    "#d53e4f",
    "#fc8d59",
    "#fee08b",
    "#ffffbf",
    "#e6f598",
    "#99d594",
    "#3288bd",
  ],
  // "2": ["#EA5A4E", "#FECDB2", "#F7FAFC", "#8EC3E7", "#1873AF"],
  "3": ["#5e3c99", "#b2abd2", "#f7f7f7", "#fdb863", "#e66101"],
};

const LEGEND_VALUES: Array<{ num: number; name: string }> = [
  { num: 9.5, name: "Great" },
  { num: 8, name: "Good" },
  { num: 7, name: "Regular" },
  { num: 6, name: "Bad" },
  { num: 4, name: "Garbage" },
];

const LEGEND_SEQ_VALUES: Array<{ num: number; name: string }> = [
  // { num: 1.4, name: "1" },
  // { num: 2.4, name: "2" },
  { num: 3.4, name: "0‒4" },
  { num: 4.4, name: "4‒5" },
  { num: 5.4, name: "5‒6" },
  { num: 6.4, name: "6‒7" },
  { num: 7.4, name: "7‒8" },
  { num: 8.4, name: "8‒9" },
  { num: 9.4, name: "9‒10" },
  // { num: 10.4, name: "10" },
];

const SCALE_DOMAIN = [5.0, 6.6, 7.6, 8.6];
const SCALE_SEQ_DOMAIN = [4, 5, 6, 7, 8, 9];

type SeriesProps = {
  series: Series;
  column: boolean;
  colorScheme: string;
};

const Error = () => {
  return <p>Sorry, we can't find any data for this series. Try another!</p>;
};

const Legend = ({
  colorScale,
  values,
}: {
  colorScale: ScaleThreshold<number, string>;
  values: Array<{ num: number; name: string }>;
}) => {
  return (
    <Flex direction="row" mr={2}>
      {values.map((e) => (
        <Flex
          key={e.name}
          direction="row"
          ml={3}
          align="center"
          justify="baseline"
        >
          <Box backgroundColor={colorScale(e.num)} width={4} height={4}></Box>
          <Text ml={1}>{e.name}</Text>
        </Flex>
      ))}
    </Flex>
  );
};

const SeriesDisplay = ({ series, column, colorScheme }: SeriesProps) => {
  // console.log(series);

  const [hoverEpisode, setHoverEpisode] = useState<Episode | null>(null);
  const onHover = useCallback(
    (episode: Episode | null) => setHoverEpisode(episode),
    [setHoverEpisode]
  );

  const bySeasonData = useMemo(() => {
    let bySeason = nest<Episode, Episode[]>()
      .key((d) => d.seasonNumber.toString())
      .sortKeys((a, b) => {
        const aNum = isNumeric(a) ? +a : 100;
        const bNum = isNumeric(b) ? +b : 100;
        return ascending(aNum, bNum);
      })
      .sortValues((a, b) => ascending(a.episodeNumber, b.episodeNumber))
      .entries(series.episodes);

    bySeason = bySeason.filter((season) =>
      season.values.some((e: Episode) => e.averageRating)
    );
    return bySeason;
  }, [series]);

  // console.log("by season", bySeasonData);

  const colorScale = useMemo(() => {
    // let scale:
    //   | ScaleThreshold<number, string>
    //   | ScaleSequential<string, number> = scaleThreshold<number, string>();
    // if (colorScheme !== "2") {
    const colors = COLOR_SCHEMES[colorScheme];

    const scale = scaleThreshold<number, string>()
      .domain(colorScheme === "2" ? SCALE_SEQ_DOMAIN : SCALE_DOMAIN)
      .range(colors);
    // } else {
    // scale = scaleSequential([0, 10], interpolateViridis);
    // }
    return scale;
  }, [colorScheme]);

  const textScale = useMemo(() => {
    let scale = scaleThreshold<number, string>()
      .domain([6.6])
      .range(["white", "black"]);
    if (colorScheme === "2") {
      scale = scaleThreshold<number, string>()
        .domain([4, 9])
        .range(["white", "black", "white"]);
    }
    if (colorScheme === "3") {
      scale = scaleThreshold<number, string>()
        .domain([5, 8.6])
        .range(["white", "black", "white"]);
    }
    return scale;
  }, [colorScheme]);

  const hasData = useMemo(() => {
    return bySeasonData && bySeasonData.length > 0;
  }, [bySeasonData]);

  const legendContent =
    colorScheme === "2" ? (
      <Legend
        colorScale={colorScale as ScaleThreshold<number, string>}
        values={LEGEND_SEQ_VALUES}
      />
    ) : (
      <Legend
        colorScale={colorScale as ScaleThreshold<number, string>}
        values={LEGEND_VALUES}
      />
    );

  const content = hasData ? (
    <AutoSizedHeatmap
      bySeason={bySeasonData}
      episodes={series.episodes}
      column={column}
      colorScale={colorScale}
      textScale={textScale}
      hover={hoverEpisode}
      onHover={onHover}
    />
  ) : (
    <Error />
  );
  return (
    <Flex direction="column" marginTop={3}>
      <Flex
        paddingBottom={3}
        direction="row"
        align="center"
        justify="space-between"
      >
        <Flex direction="row" align="center">
          <Heading>{series.primaryTitle}</Heading>
          <Box ml={3}>
            <a
              href={`https://www.imdb.com/title/${series.tconst}/episodes`}
              target="_blank"
            >
              <ImdbLogo />
            </a>
          </Box>
        </Flex>
        <Flex>{legendContent}</Flex>
      </Flex>
      <Flex paddingBottom={3}>{content}</Flex>
    </Flex>
  );
};

export default SeriesDisplay;
