/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as bookNotes from "../bookNotes.js";
import type * as lib_bookNoteLogic from "../lib/bookNoteLogic.js";
import type * as lib_bookProvider from "../lib/bookProvider.js";
import type * as lib_books from "../lib/books.js";
import type * as lib_googleBooksProvider from "../lib/googleBooksProvider.js";
import type * as lib_ratingLogic from "../lib/ratingLogic.js";
import type * as lib_reviewLogic from "../lib/reviewLogic.js";
import type * as lib_shelfLogic from "../lib/shelfLogic.js";
import type * as lib_workMatcher from "../lib/workMatcher.js";
import type * as libraries from "../libraries.js";
import type * as libraryBooks from "../libraryBooks.js";
import type * as ratings from "../ratings.js";
import type * as reviews from "../reviews.js";
import type * as search from "../search.js";
import type * as searchHistory from "../searchHistory.js";
import type * as userBooks from "../userBooks.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  bookNotes: typeof bookNotes;
  "lib/bookNoteLogic": typeof lib_bookNoteLogic;
  "lib/bookProvider": typeof lib_bookProvider;
  "lib/books": typeof lib_books;
  "lib/googleBooksProvider": typeof lib_googleBooksProvider;
  "lib/ratingLogic": typeof lib_ratingLogic;
  "lib/reviewLogic": typeof lib_reviewLogic;
  "lib/shelfLogic": typeof lib_shelfLogic;
  "lib/workMatcher": typeof lib_workMatcher;
  libraries: typeof libraries;
  libraryBooks: typeof libraryBooks;
  ratings: typeof ratings;
  reviews: typeof reviews;
  search: typeof search;
  searchHistory: typeof searchHistory;
  userBooks: typeof userBooks;
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
