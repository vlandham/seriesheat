import React from "react";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  Button,
  Text,
  Link,
  Heading,
} from "@chakra-ui/react";

const InfoModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        {/* <ModalHeader>Modal Title</ModalHeader> */}
        <ModalCloseButton />
        <ModalBody>
          <Heading mb={3}>SeriesHeat</Heading>
          <Text>
            Created by{" "}
            <Link
              href="https://vallandingham.me/"
              target="_blank"
              color="orange.400"
              isExternal
            >
              Jim Vallandingham
            </Link>
            .
          </Text>
          <br />
          <Text>
            Search for a TV Series to see a heatmap of average IMDb ratings for
            each episode. The "Flip" toggle determines if the Seasons are shown
            as columns or rows. Click on a cell to see its IMDb page.
          </Text>
          <br />
          <Text>
            Data comes from{" "}
            <Link
              href="https://www.imdb.com/interfaces/"
              target="_blank"
              color="orange.400"
              isExternal
            >
              IMDb Datasets
            </Link>
            . Data was downloaded on December 5th, 2025
          </Text>
          <br />
          <Text>
            Inspiration for this project comes from the wonderful{" "}
            <Link
              href="https://www.reddit.com/r/dataisbeautiful/comments/fw4iv0/oc_rating_of_simpsons_episodes_according_to_imdb/"
              target="_blank"
              color="orange.400"
              isExternal
            >
              Simpsons Heatmap by Hbenne
            </Link>
            .
          </Text>
          <br />
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default InfoModal;
