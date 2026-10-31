import React, { useCallback, useEffect } from "react";
import {
  Box,
  Text,
  Switch,
  Spinner,
  Container,
  Flex,
  Link,
  Heading,
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

  const emptyState = (
    <Box
      as="section"
      aria-labelledby="search-prompt-title"
      mt={{ base: 6, md: 10 }}
      px={{ base: 6, md: 12 }}
      py={{ base: 8, md: 12 }}
      bgGradient="linear(to-br, orange.50, yellow.50)"
      borderWidth="1px"
      borderColor="orange.200"
      borderRadius="xl"
      textAlign="center"
      boxShadow="sm"
    >
      <Heading
        as="h2"
        id="search-prompt-title"
        fontSize={{ base: "2xl", md: "4xl" }}
        color="gray.800"
        mb={4}
      >
        Find your next show to visualize
      </Heading>
      <Text fontSize={{ base: "lg", md: "xl" }} color="gray.700" maxW="2xl" mx="auto">
        Use the search above to find and select a TV show. Explore a heatmap of
        average IMDb ratings for every episode.
      </Text>
      <Text mt={6} fontSize="lg" color="gray.700">
        Or try:{" "}
        <Link color="orange.700" textDecoration="underline" href="#/?id=tt0096697">
          The Simpsons
        </Link>
        ,{" "}
        <Link color="orange.700" textDecoration="underline" href="#/?flip=1&id=tt0149460">
          Futurama
        </Link>
        ,{" "}
        <Link color="orange.700" textDecoration="underline" href="#/?color=1&flip=1&id=tt0056751">
          Doctor Who
        </Link>
        ,{" "}
        <Link color="orange.700" textDecoration="underline" href="#/?color=3&flip=1&id=tt0944947">
          Game of Thrones
        </Link>
        .
      </Text>
    </Box>
  );

  const content = !searchId ? (
    emptyState
  ) : seriesLoading ? (
    <Spinner size="xl" mt={4} />
  ) : seriesError ? (
    <Text mt={4}>
      Sorry, we couldn't load that series. Try searching for another!
    </Text>
  ) : series ? (
    <SeriesDisplay series={series} column={!flip} colorScheme={colorScheme} />
  ) : null;

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
