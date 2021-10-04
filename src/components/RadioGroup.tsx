import React from "react";
import { Box, Text, HStack, useRadioGroup } from "@chakra-ui/react";
import RadioCard from "./RadioCard";

const RadioGroup = ({
  title,
  selected,
  onChange,
}: {
  title: string;
  selected: string;
  onChange: (newValue: string) => void;
}) => {
  const options = ["1", "2", "3"];

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "colorScheme",
    defaultValue: selected,
    onChange: onChange,
  });
  const group = getRootProps();

  return (
    <Box>
      <Text>{title}</Text>
      <HStack {...group}>
        {options.map((value) => {
          const radio = getRadioProps({ value });
          return (
            <RadioCard key={value} {...radio}>
              {value}
            </RadioCard>
          );
        })}
      </HStack>
    </Box>
  );
};

export default RadioGroup;
