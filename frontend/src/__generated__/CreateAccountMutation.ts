/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateUserInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateAccountMutation
// ====================================================

export interface CreateAccountMutation_createUser {
  __typename: "CreateUserOutput";
  ok: boolean;
  error: string | null;
}

export interface CreateAccountMutation {
  createUser: CreateAccountMutation_createUser;
}

export interface CreateAccountMutationVariables {
  createUserInput: CreateUserInput;
}
