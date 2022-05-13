/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RunStatus } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: RunTableRunFragment
// ====================================================

export interface RunTableRunFragment_assetNodesToExecute_assetKey {
  __typename: "AssetKey";
  path: string[];
}

export interface RunTableRunFragment_assetNodesToExecute {
  __typename: "AssetNode";
  assetKey: RunTableRunFragment_assetNodesToExecute_assetKey;
}

export interface RunTableRunFragment_repositoryOrigin {
  __typename: "RepositoryOrigin";
  id: string;
  repositoryName: string;
  repositoryLocationName: string;
}

export interface RunTableRunFragment_tags {
  __typename: "PipelineTag";
  key: string;
  value: string;
}

export interface RunTableRunFragment {
  __typename: "Run";
  id: string;
  runId: string;
  status: RunStatus;
  stepKeysToExecute: string[] | null;
  assetNodesToExecute: RunTableRunFragment_assetNodesToExecute[] | null;
  canTerminate: boolean;
  mode: string;
  rootRunId: string | null;
  parentRunId: string | null;
  pipelineSnapshotId: string | null;
  pipelineName: string;
  repositoryOrigin: RunTableRunFragment_repositoryOrigin | null;
  solidSelection: string[] | null;
  tags: RunTableRunFragment_tags[];
  startTime: number | null;
  endTime: number | null;
  updateTime: number | null;
}
