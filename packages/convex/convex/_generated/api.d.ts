/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as lib_bookProvider from "../lib/bookProvider.js";
import type * as lib_books from "../lib/books.js";
import type * as lib_googleBooksProvider from "../lib/googleBooksProvider.js";
import type * as lib_workMatcher from "../lib/workMatcher.js";
import type * as search from "../search.js";
import type * as searchHistory from "../searchHistory.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "lib/bookProvider": typeof lib_bookProvider;
  "lib/books": typeof lib_books;
  "lib/googleBooksProvider": typeof lib_googleBooksProvider;
  "lib/workMatcher": typeof lib_workMatcher;
  search: typeof search;
  searchHistory: typeof searchHistory;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
