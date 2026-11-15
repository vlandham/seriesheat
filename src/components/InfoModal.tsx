import React, { useEffect, useState } from "react";

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
import { fetchMeta } from "../utils/dataUtils";

// "2026-11-15" -> "November 15, 2026" (parsed as UTC so it never shifts a day)
function formatDataDate(dataDate: string): string | null {
  const date = new Date(`${dataDate}T00:00:00Z`);
  if (isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

const InfoModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  // Refresh date comes from the API (stored alongside the data in D1), so it
  // updates on every data push without a UI deploy. Hidden if unavailable.
  const [dataDate, setDataDate] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || dataDate) return;
    let cancelled = false;
    fetchMeta()
      .then((meta) => {
        if (!cancelled && meta.dataDate) {
          setDataDate(formatDataDate(meta.dataDate));
        }
      })
      .catch(() => {
        // Leave the date hidden rather than show a wrong one.
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen, dataDate]);

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
            .{dataDate && <> Data was last refreshed on {dataDate}.</>}
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
