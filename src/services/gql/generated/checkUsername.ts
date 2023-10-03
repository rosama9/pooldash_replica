/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: checkUsername
// ====================================================

export interface checkUsername_checkUsername {
  __typename: "CheckUsernameResponse";
  username: string;
  available: boolean;
}

export interface checkUsername {
  checkUsername: checkUsername_checkUsername;
}

export interface checkUsernameVariables {
  username: string;
}
