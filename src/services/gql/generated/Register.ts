/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: Register
// ====================================================

export interface Register_register {
  __typename: "User";
  id: string;
}

export interface Register {
  register: Register_register | null;
}

export interface RegisterVariables {
  username: string;
  email: string;
  password: string;
}
