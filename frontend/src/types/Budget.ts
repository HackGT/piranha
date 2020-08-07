import { Requisition, RequisitionItem } from "./Requisition";

export type BudgetGroup = {
  id: string;
  name: string;
  budgetSet: Budget[];
}

export type Budget = {
  id: string;
  name: string;
  group: BudgetGroup;
  requisitionSet: Requisition[];
  categorySet: Category[];
}

export type Category = {
  id: string;
  name: string;
  budget: Budget;
  lineitemSet: LineItem[];
}

export type LineItem = {
  id: string;
  name: string;
  quantity: number;
  unitCost: number;
  category: Category;
  requisitionitemSet: RequisitionItem[];
}
