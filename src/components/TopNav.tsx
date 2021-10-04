import React from "react";
import {
  Flex,
  Heading,
  Text,
  Link,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";

import Logo from "./Logo";
import InfoIcon from "./InfoIcon";
import InfoModal from "./InfoModal";

const TopNav = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Flex direction="column" justify="center" align="center">
        <Flex direction="row" mt="2" justify="center" align="center">
          <Logo />
          <Heading mt={1}>SeriesHeat</Heading>
        </Flex>
        <Flex align="center">
          <Text>
            by{" "}
            <Link href="https://vallandingham.me/" target="_blank">
              Jim Vallandingham
            </Link>
          </Text>
          <IconButton
            aria-label="information"
            colorScheme="white"
            icon={<InfoIcon />}
            onClick={onOpen}
          />
        </Flex>
      </Flex>
      <InfoModal onClose={onClose} isOpen={isOpen} />
    </>
  );
};

export default TopNav;
