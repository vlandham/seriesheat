import React, { useCallback, useEffect } from "react";
import {
  Box,
  Text,
  Switch,
  Spinner,
  Container,
  Flex,
  Link,
} from "@chakra-ui/react";
import Search from "./Search";
import { fetchRatings } from "../utils/dataUtils";
import useStore from "../store";
import SeriesDisplay from "./Series";
import {
  useQueryParam,
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
    seriesError,
    setSeries,
    setSeriesLoading,
    setSeriesError,
  } = useStore();
  const handleSearchChange = useCallback((newSearch: string) => {
    setSearchId(newSearch);
  }, []);

  useEffect(() => {
    if (!searchId) return;
    // ignore responses for an id that is no longer selected
    let cancelled = false;
    setSeriesLoading(true);
    fetchRatings(searchId)
      .then((ratings) => {
        if (!cancelled) setSeries(ratings);
      })
      .catch((error: Error) => {
        if (!cancelled) setSeriesError(error.message);
      });
    return () => {
      cancelled = true;
    };
  }, [searchId]);

  const flipCallback = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setFlip(e.currentTarget.checked);
  }, []);

  const content = seriesLoading ? (
    <Spinner size="xl" mt={4} />
  ) : seriesError ? (
    <Text mt={4}>
      Sorry, we couldn't load that series. Try searching for another!
    </Text>
  ) : series ? (
    <SeriesDisplay series={series} column={!flip} colorScheme={colorScheme} />
  ) : (
    <Box mt={4}>
      <Text>
        Search for a TV series and get a heatmap of average IMDb ratings for
        each episode!
      </Text>
      <Text>
        Examples:{" "}
        <Link color="orange.400" href="#/?id=tt0096697">
          The Simpsons
        </Link>
        ,{" "}
        <Link color="orange.400" href="#/?flip=1&id=tt0149460">
          Futurama
        </Link>
        ,{" "}
        <Link color="orange.400" href="#/?color=1&flip=1&id=tt0056751">
          Doctor Who
        </Link>
        ,{" "}
        <Link color="orange.400" href="#/?color=3&flip=1&id=tt0944947">
          Game of Thrones
        </Link>
        .
      </Text>
    </Box>
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
