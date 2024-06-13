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
RouteStrings.PAYMENT_BASE_URL = `${_a.MAIN_BASE_URL}/payments`;
RouteStrings.DASHBOARD_BASE_URL = `${_a.MAIN_BASE_URL}/dashboard`;
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
//PRODUCT CATEGORIES
RouteStrings.NEW_CATEGORY = "/category/new";
RouteStrings.ALL_CATEGORIES = "/category/all";
RouteStrings.DELETE_CATEGORY = "/category/:id";
//ORDER ENDPOINTS
RouteStrings.NEW_ORDER = "/new";
RouteStrings.MY_ORDERS = "/my";
RouteStrings.ALL_ORDERS = "/all";
RouteStrings.SINGLE_ORDER_ID = "/:id";
//COUPON ENDPOINTS
RouteStrings.NEW_COUPON = "/coupon/new";
RouteStrings.ALL_COUPON = "/coupon/all";
RouteStrings.SINGLE_COUPON_ID = "/coupon/:id";
RouteStrings.DISCOUNT = "/discount";
//DASHBOARD ENDPOINTS
RouteStrings.DASHBOARD_STATS = "/stats";
RouteStrings.DASHBOARD_PIE = "/pie";
RouteStrings.DASHBOARD_BAR = "/bar";
RouteStrings.DASHBOARD_LINE = "/line";
//PAYMENT ENDPOINTS
RouteStrings.STRIPE_PAYMENT = "/create";
