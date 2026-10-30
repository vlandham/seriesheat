import React, { useCallback, useRef } from "react";
import { Flex, Text } from "@chakra-ui/react";

import AsyncSelect from "react-select/async";
import { fetchSearch } from "../utils/dataUtils";
import { SearchResult } from "../types";

const SEARCH_DEBOUNCE_MS = 250;

type Option = {
  value: string;
  label: string;
};

type SearchProps = {
  onChange: (newValue: string) => void;
};

function toOption(r: SearchResult): Option {
  // Format label with startYear in parentheses if available
  const label = r.startYear ? `${r.primaryTitle} (${r.startYear})` : r.primaryTitle;
  return { value: r.tconst, label };
}

const Search = ({ onChange }: SearchProps) => {
  const debounceTimer = useRef<number>();

  const onChangeCallback = useCallback(
    (selected: Option | null) => {
      if (selected) onChange(selected.value);
    },
    [onChange]
  );

  // Superseded keystrokes are left pending: react-select only renders the
  // latest request, and resolving them with [] would poison cacheOptions.
  const loadOptions = useCallback(
    (inputValue: string) =>
      new Promise<Option[]>((resolve) => {
        window.clearTimeout(debounceTimer.current);
        debounceTimer.current = window.setTimeout(() => {
          fetchSearch(inputValue)
            .then((results) => resolve(results.map(toOption)))
            .catch(() => resolve([]));
        }, SEARCH_DEBOUNCE_MS);
      }),
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
