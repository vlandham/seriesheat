import React, { useMemo, useCallback } from "react";
import { Flex, Text } from "@chakra-ui/react";

import AsyncSelect from "react-select/async";
import { fetchSearch } from "../utils/dataUtils";
import { SearchResult } from "../types";

type Option = {
  value: string;
  label: string;
};

type SearchProps = {
  onChange: (newValue: string) => void;
};

const Search = ({ onChange }: SearchProps) => {
  const onChangeCallback = useCallback(
    (selected) => {
      onChange(selected.value);
    },
    [onChange]
  );

  const loadOptions = useCallback(
    async (inputValue: string, callback: (options: Option[]) => void) => {
      const results = await fetchSearch(inputValue);
      let options: Option[] = [];
      if (results && results) {
        options = results.slice(0, 30).map((r: SearchResult) => {
          // Format label with startYear in parentheses if available
          let label = r.primaryTitle;
          if (r.startYear) {
            label = `${r.primaryTitle} (${r.startYear})`;
          }
          return {
            value: r.tconst,
            label: label,
          };
        });
      }
      callback(options);
    },
    []
  );

  return (
    <Flex direction="column" maxWidth={500} minWidth={100}>
      <Text>Search</Text>
      <AsyncSelect
        cacheOptions
        loadOptions={loadOptions}
        isMulti={false}
        placeholder=""
        noOptionsMessage={() => "Search for a TV Series"}
        onChange={onChangeCallback}
      />
    </Flex>
  );
};

export default Search;
