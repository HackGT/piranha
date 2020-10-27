import { Requisition, RequisitionItem } from "./Requisition";

export type Budget = {
  id: string;
  name: string;
  requisitions: Requisition[];
  categories: Category[];
}

export type Category = {
  id: string;
  name: string;
  budget: Budget;
  lineItems: LineItem[];
}

export type LineItem = {
  id: string;
  name: string;
  quantity: number;
  unitCost: number;
  items: RequisitionItem[];
  category: Category;
}
