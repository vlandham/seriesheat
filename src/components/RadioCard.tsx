import React from "react";
import { Box, useRadio } from "@chakra-ui/react";

type RadioCardProps = {
  // isInvalid: boolean;
  // isFocused: boolean;
  // isChecked: boolean;
  // isActive: boolean;
  // isHovered: boolean;
  // isDisabled: boolean;
  // isReadOnly: boolean;
  // isRequired: boolean;
  children: React.ReactNode;
};

function RadioCard(props: any) {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        _checked={{
          bg: "gray.600",
          color: "white",
          borderColor: "teal.600",
        }}
        _focus={{
          boxShadow: "outline",
        }}
        px={4}
        py={1}
      >
        {props.children}
      </Box>
    </Box>
  );
}

export default RadioCard;
