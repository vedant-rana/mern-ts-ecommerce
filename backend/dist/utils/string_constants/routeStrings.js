var _a;
export class RouteStrings {
}
_a = RouteStrings;
//MAIN BASE URL
RouteStrings.MAIN_BASE_URL = "/api/v1";
//BASE URLS
RouteStrings.USER_BASE_URL = `${_a.MAIN_BASE_URL}/users`;
RouteStrings.PRODUCT_BASE_URL = `${_a.MAIN_BASE_URL}/products`;
RouteStrings.ORDER_BASE_URL = `${_a.MAIN_BASE_URL}/orders`;
//USER ENDPOINTS
RouteStrings.NEW_USER = "/new";
RouteStrings.ALL_USERS = "/all";
RouteStrings.SINGLE_USER_ID = "/:id";
//PRODUCT ENDPOINTS
RouteStrings.NEW_PRODUCT = "/new";
RouteStrings.ADMIN_PRODUCT = "/admin-products";
RouteStrings.SINGLE_PRODUCT_ID = "/:id";
RouteStrings.LATEST_PRODUCTS = "/latest";
RouteStrings.PRODUCT_CATEGORIES = "/categories";
RouteStrings.ALL_PRODUCTS = "/all";
//ORDER ENDPOINTS
RouteStrings.NEW_ORDER = "/new";
