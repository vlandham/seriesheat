import React, { useCallback, useEffect, useState } from "react";
import { Box, Text, Switch, Spinner, Container, Flex } from "@chakra-ui/react";
import Search from "./Search";
import { fetchRatings } from "../utils/dataUtils";
import useStore from "../store";
import { Series } from "../types";
import SeriesDisplay from "./Series";
import {
  useQueryParam,
  NumberParam,
  StringParam,
  BooleanParam,
  withDefault,
} from "use-query-params";
import TopNav from "./TopNav";
import RadioGroup from "./RadioGroup";

const Home = () => {
  const [searchId, setSearchId] = useQueryParam("id", StringParam);
  const [flip, setFlip] = useQueryParam(
    "flip",
    withDefault(BooleanParam, false)
  );
  const [colorScheme, setColorScheme] = useQueryParam(
    "color",
    withDefault(StringParam, "1")
  );
  const {
    series,
    seriesLoading,
    // searchId,
    // setSearchId,
    setSeries,
    setSeriesLoading,
  } = useStore();
  const handleSearchChange = useCallback((newSearch: string) => {
    setSearchId(newSearch);
  }, []);

  useEffect(() => {
    async function onIdChange() {
      if (searchId) {
        setSeriesLoading(true);
        const ratings = await fetchRatings(searchId);
        setSeries(ratings as Series);
      }
    }
    onIdChange();
  }, [searchId]);

  const flipCallback = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setFlip(e.currentTarget.checked);
  }, []);

  const content =
    series && !seriesLoading ? (
      <SeriesDisplay series={series} column={!flip} colorScheme={colorScheme} />
    ) : seriesLoading ? (
      <Spinner size="xl" mt={4} />
    ) : (
      <Text mt={4}>
        Search for a TV series and get an IMDb average rating heatmap!
      </Text>
    );

  return (
    <Container maxW="container.xl">
      <TopNav />
      <Flex align="center" justify="space-between" marginTop={3}>
        <Box flexGrow={1} marginRight={4}>
          <Search onChange={handleSearchChange} />
        </Box>
        <Box marginRight={4}>
          <RadioGroup
            title="Color Scheme"
            selected={colorScheme}
            onChange={setColorScheme}
          />
        </Box>
        <Box>
          <Box>
            <Text mb={1}>Flip</Text>
            <Switch size="lg" isChecked={flip} onChange={flipCallback}></Switch>
          </Box>
        </Box>
      </Flex>
      {content}
    </Container>
  );
};

export default Home;
