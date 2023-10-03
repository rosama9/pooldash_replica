/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AccountInfo
// ====================================================

export interface AccountInfo_pools {
  __typename: "PoolListResponse";
  count: number;
}

export interface AccountInfo_me {
  __typename: "User";
  joined_ts: number;
  email: string;
}

export interface AccountInfo_history {
  __typename: "HistoryResponse";
  count: number;
}

export interface AccountInfo {
  pools: AccountInfo_pools;
  me: AccountInfo_me | null;
  history: AccountInfo_history;
}
