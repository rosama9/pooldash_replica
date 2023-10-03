/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Pools
// ====================================================

export interface Pools_pools {
  __typename: "PoolListResponse";
  count: number;
}

export interface Pools_me {
  __typename: "User";
  joined_ts: number;
  email: string;
}

export interface Pools {
  pools: Pools_pools;
  me: Pools_me | null;
}
