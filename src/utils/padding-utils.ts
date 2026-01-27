import { Padding } from "../types/table-cell-types";

export function getPadding(padding: Padding | undefined): Required<Padding> {
  return {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    ...padding,
  };
}
