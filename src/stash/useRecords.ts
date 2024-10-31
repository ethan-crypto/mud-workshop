import {
  getRecords,
  Key,
  Stash,
  TableRecords,
} from "@latticexyz/stash/internal";
import { Table } from "@latticexyz/config";
import { useStash } from "@latticexyz/stash/react";
import isEqual from "fast-deep-equal";

export type UseRecordsArgs<table extends Table = Table> = {
  stash: Stash;
  table: table;
  keys?: readonly Key<table>[];
};

export type UseRecordsResult<table extends Table = Table> = TableRecords<table>;

export function useRecords<const table extends Table>({
  stash,
  ...args
}: UseRecordsArgs<table>): UseRecordsResult<table> {
  return useStash(stash, (state) => getRecords({ state, ...args }), {
    isEqual,
  });
}
