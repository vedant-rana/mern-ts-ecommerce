export type IUser = {
  name: string;
  email: string;
  photo: string;
  gender: string;
  role: string;
  dob: string;
  _id: string;
};

export type IProduct = {
  name: string;
  price: number;
  stock: number;
  category: string;
  photo: string;
  _id: string;
};

export type ICartItem = {
  productId: string;
  photo: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
};

export type IOrderItem = Omit<ICartItem, "stock"> & {
  _id: string;
};

export type ShippingInfo = {
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
};

export type IOrder = {
  orderItems: IOrderItem[];
  shippingInfo: ShippingInfo;
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  status: string;
  user: {
    name: string;
    _id: string;
  };
  _id: string;
};

//Dashboard and Admin stats and charts types started
type CountAndChange = {
  revenue: number;
  product: number;
  user: number;
  order: number;
};

type LatestTransactions = {
  _id: string;
  discount: number;
  amount: number;
  quantity: number;
  status: string;
};

export type IStat = {
  categoryCount: Record<string, number>[];
  changePercent: CountAndChange;
  counts: CountAndChange;
  chart: {
    order: number[];
    revenue: number[];
  };
  userRatio: {
    male: number;
    female: number;
  };
  latestTransactions: LatestTransactions[];
};

type RevenueDistribution = {
  netMargin: number;
  discount: number;
  productionCost: number;
  burnt: number;
  marketingCost: number;
};

type OrderFullfillment = {
  processing: number;
  shipped: number;
  delivered: number;
};

type UsersAgeGroup = { teen: number; adult: number; old: number };

export type IPie = {
  orderFullfillment: OrderFullfillment;
  pouductCategories: Record<string, number>[];
  stockAvailibility: {
    inStock: number;
    outOfStock: number;
  };
  revenueDistribution: RevenueDistribution;
  adminUsers: number;
  usersAgeGroup: UsersAgeGroup;
  adminCustomers: { admin: number; customer: number };
};
