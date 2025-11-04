/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as actions_order from "../actions/order.js";
import type * as functions_cart from "../functions/cart.js";
import type * as functions_checkout from "../functions/checkout.js";
import type * as functions_createProducts from "../functions/createProducts.js";
import type * as functions_getProducts from "../functions/getProducts.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "actions/order": typeof actions_order;
  "functions/cart": typeof functions_cart;
  "functions/checkout": typeof functions_checkout;
  "functions/createProducts": typeof functions_createProducts;
  "functions/getProducts": typeof functions_getProducts;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {};
