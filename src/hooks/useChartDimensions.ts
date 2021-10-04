import { useMemo } from "react";

import { Margin } from "../types";

const DEFAULT_MARGIN = {
  top: 10,
  right: 10,
  bottom: 30,
  left: 10,
};

type UseChartDimensionsInput = {
  width: number;
  height: number;
  margin?: Margin;
};

type UseChartDimensionsOutput = {
  margin: Margin;
  innerWidth: number;
  innerHeight: number;
};

function useChartDimensions({
  width,
  height,
  margin: marginInput = DEFAULT_MARGIN,
}: UseChartDimensionsInput): UseChartDimensionsOutput {
  // memoize margin object
  const margin = useMemo(
    () => ({
      top: marginInput.top,
      right: marginInput.right,
      bottom: marginInput.bottom,
      left: marginInput.left,
    }),
    [marginInput.top, marginInput.right, marginInput.bottom, marginInput.left]
  );

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - marginInput.top - marginInput.bottom;

  return {
    margin,
    innerWidth,
    innerHeight,
  };
}

export default useChartDimensions;
