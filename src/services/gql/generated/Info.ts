/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Info
// ====================================================

export interface Info_pools {
  __typename: "PoolListResponse";
  count: number;
}

export interface Info_me {
  __typename: "User";
  joined_ts: number;
  email: string;
}

export interface Info_history {
  __typename: "HistoryResponse";
  count: number;
}

export interface Info {
  pools: Info_pools;
  me: Info_me | null;
  history: Info_history;
}
