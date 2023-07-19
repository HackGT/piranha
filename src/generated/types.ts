export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: number;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
  Upload: any;
};

export type AccessLevel =
  | 'NONE'
  | 'MEMBER'
  | 'EXEC'
  | 'ADMIN';

export type Approval = {
  __typename?: 'Approval';
  id: Scalars['ID'];
  requisition: Requisition;
  isApproving: Scalars['Boolean'];
  notes?: Maybe<Scalars['String']>;
  approver: User;
  date: Scalars['Date'];
};

export type ApprovalInput = {
  isApproving: Scalars['Boolean'];
  notes?: Maybe<Scalars['String']>;
  requisition: Scalars['ID'];
};

export type Budget = {
  __typename?: 'Budget';
  id: Scalars['ID'];
  name: Scalars['String'];
  categories: Array<Category>;
  requisitions: Array<Requisition>;
  archived: Scalars['Boolean'];
};

export type BudgetInput = {
  name: Scalars['String'];
  archived?: Maybe<Scalars['Boolean']>;
};

export type Category = {
  __typename?: 'Category';
  id: Scalars['ID'];
  name: Scalars['String'];
  lineItems: Array<LineItem>;
};

export type CategoryInput = {
  name: Scalars['String'];
  budget: Scalars['ID'];
};


export type File = {
  __typename?: 'File';
  id: Scalars['ID'];
  name: Scalars['String'];
  googleName: Scalars['String'];
  mimetype: Scalars['String'];
  isActive: Scalars['Boolean'];
  signedUrl: Scalars['String'];
};

export type LineItem = {
  __typename?: 'LineItem';
  id: Scalars['ID'];
  name: Scalars['String'];
  quantity?: Maybe<Scalars['Int']>;
  unitCost?: Maybe<Scalars['Float']>;
  category: Category;
};

export type LineItemInput = {
  name: Scalars['String'];
  quantity: Scalars['Int'];
  unitCost: Scalars['Float'];
  category: Scalars['ID'];
};

export type Month =
  | 'JANUARY'
  | 'FEBRUARY'
  | 'MARCH'
  | 'APRIL'
  | 'MAY'
  | 'JUNE'
  | 'JULY'
  | 'AUGUST'
  | 'SEPTEMBER'
  | 'OCTOBER'
  | 'NOVEMBER'
  | 'DECEMBER';

export type Mutation = {
  __typename?: 'Mutation';
  updateUser?: Maybe<User>;
  createRequisition?: Maybe<Requisition>;
  updateRequisition?: Maybe<Requisition>;
  createProject?: Maybe<Project>;
  updateProject?: Maybe<Project>;
  createCategory?: Maybe<Category>;
  updateCategory?: Maybe<Category>;
  createVendor?: Maybe<Vendor>;
  updateVendor?: Maybe<Vendor>;
  createBudget?: Maybe<Budget>;
  updateBudget?: Maybe<Budget>;
  createPaymentMethod?: Maybe<PaymentMethod>;
  updatePaymentMethod?: Maybe<PaymentMethod>;
  createLineItem?: Maybe<LineItem>;
  updateLineItem?: Maybe<LineItem>;
  createPayment?: Maybe<Payment>;
  createApproval?: Maybe<Approval>;
};


export type MutationUpdateUserArgs = {
  data: UserInput;
  id: Scalars['ID'];
};


export type MutationCreateRequisitionArgs = {
  data: RequisitionInput;
};


export type MutationUpdateRequisitionArgs = {
  data: RequisitionInput;
  id: Scalars['ID'];
};


export type MutationCreateProjectArgs = {
  data: ProjectInput;
};


export type MutationUpdateProjectArgs = {
  data: ProjectInput;
  id: Scalars['ID'];
};


export type MutationCreateCategoryArgs = {
  data: CategoryInput;
};


export type MutationUpdateCategoryArgs = {
  data: CategoryInput;
  id: Scalars['ID'];
};


export type MutationCreateVendorArgs = {
  data: VendorInput;
};


export type MutationUpdateVendorArgs = {
  data: VendorInput;
  id: Scalars['ID'];
};


export type MutationCreateBudgetArgs = {
  data: BudgetInput;
};


export type MutationUpdateBudgetArgs = {
  data: BudgetInput;
  id: Scalars['ID'];
};


export type MutationCreatePaymentMethodArgs = {
  data: PaymentMethodInput;
};


export type MutationUpdatePaymentMethodArgs = {
  data: PaymentMethodInput;
  id: Scalars['ID'];
};


export type MutationCreateLineItemArgs = {
  data: LineItemInput;
};


export type MutationUpdateLineItemArgs = {
  data: LineItemInput;
  id: Scalars['ID'];
};


export type MutationCreatePaymentArgs = {
  data: PaymentInput;
};


export type MutationCreateApprovalArgs = {
  data: ApprovalInput;
};

export type OperatingBudget = {
  __typename?: 'OperatingBudget';
  id: Scalars['ID'];
  month?: Maybe<Month>;
  year?: Maybe<Scalars['Int']>;
  lineItems: Array<OperatingLineItem>;
};

export type OperatingLineItem = {
  __typename?: 'OperatingLineItem';
  id: Scalars['ID'];
  name: Scalars['String'];
  cost?: Maybe<Scalars['Float']>;
};

export type Payment = {
  __typename?: 'Payment';
  id: Scalars['ID'];
  amount: Scalars['Float'];
  fundingSource: PaymentMethod;
  date: Scalars['String'];
  requisition: Requisition;
};

export type PaymentInput = {
  amount: Scalars['Float'];
  fundingSource: Scalars['ID'];
  date: Scalars['String'];
  requisition: Scalars['ID'];
};

export type PaymentMethod = {
  __typename?: 'PaymentMethod';
  id: Scalars['ID'];
  name: Scalars['String'];
  reimbursementInstructions?: Maybe<Scalars['String']>;
  isDirectPayment: Scalars['Boolean'];
  isActive: Scalars['Boolean'];
};

export type PaymentMethodInput = {
  name: Scalars['String'];
  isActive?: Maybe<Scalars['Boolean']>;
  isDirectPayment?: Maybe<Scalars['Boolean']>;
  reimbursementInstructions?: Maybe<Scalars['String']>;
};

export type Project = {
  __typename?: 'Project';
  id: Scalars['ID'];
  name: Scalars['String'];
  archived: Scalars['Boolean'];
  leads: Array<User>;
  shortCode: Scalars['String'];
  year: Scalars['Int'];
  referenceString: Scalars['String'];
  requisitions: Array<Requisition>;
};

export type ProjectInput = {
  name: Scalars['String'];
  leads: Array<Scalars['ID']>;
  shortCode: Scalars['String'];
  year: Scalars['Int'];
  archived?: Maybe<Scalars['Boolean']>;
};

export type Query = {
  __typename?: 'Query';
  /** Gets currently signed in user */
  user: User;
  users?: Maybe<Array<Maybe<User>>>;
  project?: Maybe<Project>;
  projects?: Maybe<Array<Maybe<Project>>>;
  vendor?: Maybe<Vendor>;
  vendors?: Maybe<Array<Maybe<Vendor>>>;
  requisition?: Maybe<Requisition>;
  /** Gets all requisitions created by current user */
  requisitions?: Maybe<Array<Maybe<Requisition>>>;
  paymentMethods?: Maybe<Array<Maybe<PaymentMethod>>>;
  budget?: Maybe<Budget>;
  budgets?: Maybe<Array<Maybe<Budget>>>;
};


export type QueryProjectArgs = {
  year: Scalars['Int'];
  shortCode: Scalars['String'];
};


export type QueryProjectsArgs = {
  archived?: Maybe<Scalars['Boolean']>;
};


export type QueryVendorArgs = {
  id: Scalars['ID'];
};


export type QueryVendorsArgs = {
  isActive?: Maybe<Scalars['Boolean']>;
};


export type QueryRequisitionArgs = {
  year: Scalars['Int'];
  shortCode: Scalars['String'];
  projectRequisitionId: Scalars['Int'];
};


export type QueryPaymentMethodsArgs = {
  isActive?: Maybe<Scalars['Boolean']>;
};


export type QueryBudgetArgs = {
  id: Scalars['ID'];
};


export type QueryBudgetsArgs = {
  archived?: Maybe<Scalars['Boolean']>;
};

export type Requisition = {
  __typename?: 'Requisition';
  id: Scalars['ID'];
  headline: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  items: Array<RequisitionItem>;
  status: RequisitionStatus;
  createdBy: User;
  project: Project;
  projectRequisitionId: Scalars['Int'];
  paymentRequiredBy?: Maybe<Scalars['String']>;
  otherFees?: Maybe<Scalars['Float']>;
  isReimbursement: Scalars['Boolean'];
  budget?: Maybe<Budget>;
  approvals: Array<Approval>;
  payments: Array<Payment>;
  files: Array<File>;
  shippingLocation?: Maybe<Scalars['String']>;
  orderDate?: Maybe<Scalars['String']>;
  fundingSource?: Maybe<PaymentMethod>;
  purchaseDate?: Maybe<Scalars['String']>;
  referenceString: Scalars['String'];
  canEdit: Scalars['Boolean'];
  canCancel: Scalars['Boolean'];
  canExpense: Scalars['Boolean'];
};

export type RequisitionInput = {
  headline?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  items?: Maybe<Array<RequisitionItemInput>>;
  status: RequisitionStatus;
  project?: Maybe<Scalars['ID']>;
  paymentRequiredBy?: Maybe<Scalars['String']>;
  otherFees?: Maybe<Scalars['Float']>;
  isReimbursement?: Maybe<Scalars['Boolean']>;
  budget?: Maybe<Scalars['ID']>;
  files?: Maybe<Array<Scalars['Upload']>>;
  shippingLocation?: Maybe<Scalars['String']>;
  orderDate?: Maybe<Scalars['String']>;
  fundingSource?: Maybe<Scalars['ID']>;
  purchaseDate?: Maybe<Scalars['String']>;
};

export type RequisitionItem = {
  __typename?: 'RequisitionItem';
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  quantity?: Maybe<Scalars['Int']>;
  unitPrice?: Maybe<Scalars['Float']>;
  link?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
  received?: Maybe<Scalars['Boolean']>;
  lineItem?: Maybe<LineItem>;
  vendor?: Maybe<Vendor>;
};

export type RequisitionItemInput = {
  name?: Maybe<Scalars['String']>;
  quantity?: Maybe<Scalars['Int']>;
  unitPrice?: Maybe<Scalars['Float']>;
  link?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
  received?: Maybe<Scalars['Boolean']>;
  lineItem?: Maybe<Scalars['ID']>;
  vendor?: Maybe<Scalars['ID']>;
};

export type RequisitionStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'PENDING_CHANGES'
  | 'READY_TO_ORDER'
  | 'ORDERED'
  | 'PARTIALLY_RECEIVED'
  | 'RECEIVED'
  | 'CLOSED'
  | 'CANCELLED'
  | 'READY_FOR_REIMBURSEMENT'
  | 'AWAITING_INFORMATION'
  | 'REIMBURSEMENT_IN_PROGRESS';


export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  uuid: Scalars['String'];
  email: Scalars['String'];
  name: Scalars['String'];
  accessLevel: AccessLevel;
  slackId?: Maybe<Scalars['String']>;
  canViewAdminPanel: Scalars['Boolean'];
};

export type UserInput = {
  name: Scalars['String'];
  slackId?: Maybe<Scalars['String']>;
  accessLevel: AccessLevel;
};

export type Vendor = {
  __typename?: 'Vendor';
  id: Scalars['ID'];
  name: Scalars['String'];
  isActive: Scalars['Boolean'];
};

export type VendorInput = {
  name: Scalars['String'];
  isActive?: Maybe<Scalars['Boolean']>;
};
