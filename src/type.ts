export interface ItemType {
  item_name: string;
  quantity: number;
  unit: string;
  price: number;
}

export interface InvoiceDataType {
  userId: number;
  user_name?: string;
  email?: string;

  customer: string;
  date: string | Date;

  subtotal: number;
  discount: number;
  received: number;
  due: number;

  paymentType: string;

  items: ItemType[];
}
export interface CreateInvoiceRequest {
  uid: string;
  userId: number;

  date?: string;
  customer: string;
  total: number;
  subtotal: number;
  discount?: number;
  received?: number;
  due?: number;

  paymentType: string;

  description?: string;

  items: {
    item_name: string;
    quantity: number;
    unit: string;
    price: number;
  }[];
}
