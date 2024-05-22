export class RouteStrings {
  //MAIN BASE URL
  public static readonly MAIN_BASE_URL: string = "/api/v1";

  //BASE URLS
  public static readonly USER_BASE_URL: string = `${this.MAIN_BASE_URL}/users`;
  public static readonly PRODUCT_BASE_URL: string = `${this.MAIN_BASE_URL}/products`;
  public static readonly ORDER_BASE_URL: string = `${this.MAIN_BASE_URL}/orders`;

  //USER ENDPOINTS
  public static readonly NEW_USER: string = "/new";
  public static readonly ALL_USERS: string = "/all";
  public static readonly SINGLE_USER_ID: string = "/:id";

  //PRODUCT ENDPOINTS
  public static readonly NEW_PRODUCT: string = "/new";
  public static readonly ADMIN_PRODUCT: string = "/admin-products";
  public static readonly SINGLE_PRODUCT_ID: string = "/:id";
  public static readonly LATEST_PRODUCTS: string = "/latest";
  public static readonly PRODUCT_CATEGORIES: string = "/categories";
  public static readonly ALL_PRODUCTS: string = "/all";

  //ORDER ENDPOINTS
  public static readonly NEW_ORDER: string = "/new";
  public static readonly MY_ORDERS: string = "/my";
  public static readonly ALL_ORDERS: string = "/all";
  public static readonly SINGLE_ORDER_ID: string = "/:id";
}
