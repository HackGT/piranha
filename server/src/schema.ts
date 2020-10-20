import dotenv from "dotenv"
import mongoose from "mongoose";

dotenv.config()

mongoose.connect(String(process.env.MONGO_URL), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).catch(err => {
    throw err;
});

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
interface RootDocument {
    _id: mongoose.Types.ObjectId;
}
export function createNew<T extends RootDocument>(model: mongoose.Model<T & mongoose.Document, {}>, doc: Omit<T, "_id">) {
    return new model(doc);
}

export enum AccessLevel {
    NONE = "NONE",
    MEMBER = "MEMBER",
    EXEC = "EXEC",
    ADMIN = "ADMIN"
}

export interface IUser extends RootDocument {
    uuid: string;
    email: string;
    name: string;
    token: string;
    accessLevel: string;
    slackId?: string;
}
const UserSchema = new mongoose.Schema({
    uuid: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    token: String,
    accessLevel: {
        type: String,
        required: true
    },
    slackId: String
},
    {
        usePushEach: true
    }
)
export const User = mongoose.model<IUser & mongoose.Document>("User", UserSchema);

enum RequisitionStatus {
    DRAFT = "Draft",
    SUBMITTED = "Submitted",
    PENDING_CHANGES = "Pending Changes",
    READY_TO_ORDER = "Ready to Order",
    ORDERED = "Ordered",
    PARTIALLY_RECEIVED = "Partially Received",
    RECEIVED = "Received",
    CLOSED = "Closed",
    CANCELLED = "Cancelled",
    READY_FOR_REIMBURSEMENT = "Ready for Reimbursement",
    AWAITING_INFORMATION = "Awaiting Information",
    REIMBURSEMENT_IN_PROGRESS = "Reimbursement in Progress"
}

export interface IRequisitionItem {
    name: string;
    quantity: number;
    unitPrice: number;
    link: string;
    notes: string;
    received: boolean;
    lineItem: ILineItem;
}

export interface IApproval {
    isApproving: boolean;
    notes: string;
    approver: IUser;
}

export interface IPayment {
    recipient: IVendor;
    amount: number;
    fundingSource: IPaymentMethod;
    date: Date;
}

export interface IFile {
    name: string;
    googleName: string;
    type: string;
    isActive: boolean;
}

export interface IRequisition extends RootDocument {
    headline: string;
    description: string;
    items: IRequisitionItem[];
    status: RequisitionStatus;
    createdBy: IUser;
    project: IProject;
    vendor: IVendor;
    projectRequisitionId: number;
    paymentRequiredBy: Date;
    otherFees: number;
    isReimbursement: boolean;
    budget: IBudget;
    approvals: IApproval[];
    payments: IPayment[];
    files: IFile[];
    // Only used for non-reimbursements
    shippingLocation: string;
    orderDate: Date;
    // Only used for reimbursements
    fundingSource: IPaymentMethod;
    purchaseDate: Date;
}
const RequisitionSchema = new mongoose.Schema({
    headline: {
        type: String,
        required: true
    },
    description: String,
    items: {
        name: String,
        quantity: Number,
        unitPrice: Number,
        link: String,
        notes: String,
        received: Boolean,
        lineItem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "LineItem"
        },
    },
    status: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor"
    },
    projectRequisitionId: {
        type: Number,
        required: true
    },
    paymentRequiredBy: Date,
    otherFees: Number,
    isReimbursement: Boolean,
    budget: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Budget"
    },
    approvals: [{
        isApproving: Boolean,
        notes: String,
        approver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    }],
    payments: [{
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vendor"
        },
        amount: Number,
        fundingSource: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "FundingSource"
        },
        date: Date
    }],
    files: [{
        name: String,
        googleName: String,
        type: String,
        isActive: Boolean
    }],
    shippingLocation: String,
    orderDate: Date,
    fundingSource: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PaymentMethod"
    },
    purchaseDate: Date
});
export const Requisition = mongoose.model<IRequisition & mongoose.Document>("Requisition", RequisitionSchema);

export interface IProject extends RootDocument {
    name: string;
    archived: boolean;
    leads: IUser[];
    shortCode: string;
    year: number;
    referenceString: string;
}
const ProjectSchema = new mongoose.Schema({
    name: String,
    archived: Boolean,
    leads: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    shortCode: String,
    year: Number
});

ProjectSchema.virtual("referenceString").get(function (this: IProject) {
    return `${this.year}-${this.shortCode}`
})

export const Project = mongoose.model<IProject & mongoose.Document>("Project", ProjectSchema);


export interface IVendor extends RootDocument {
    name: string;
    isActive: boolean;
}
const VendorSchema = new mongoose.Schema({
    name: String,
    isActive: Boolean
});
export const Vendor = mongoose.model<IVendor & mongoose.Document>("Vendor", VendorSchema);


export interface IPaymentMethod extends RootDocument {
    name: string;
    reimbursementInstructions: string;
    isDirectPayment: boolean;
    isActive: boolean;
}
const PaymentMethodSchema = new mongoose.Schema({
    name: String,
    reimbursementInstructions: String,
    isDirectPayment: Boolean,
    isActive: Boolean
});
export const PaymentMethod = mongoose.model<IPaymentMethod & mongoose.Document>("PaymentMethod", PaymentMethodSchema);

export interface ILineItem extends RootDocument {
    name: string;
    quantity: number;
    unitCost: number;
}
const LineItemSchema = new mongoose.Schema({
    name: String,
    quantity: Number,
    unitCost: Number
});

export interface ICategory {
    name: string;
    lineItems: ILineItem[];
}

export interface IBudget extends RootDocument {
    name: string;
    categories: ICategory[];
}
const BudgetSchema = new mongoose.Schema({
    name: String,
    categories: [{
        name: String,
        lineItems: [LineItemSchema]
    }]
});

export interface IBudgetGroup extends RootDocument {
    name: string;
    budgets: IBudget[];
}
const BudgetGroupSchema = new mongoose.Schema({
    name: String,
    budgets: [BudgetSchema]
});
export const BudgetGroup = mongoose.model<IBudgetGroup & mongoose.Document>("BudgetGroup", BudgetGroupSchema);

export enum Month {
    JANUARY = "JANUARY",
    FEBRUARY = "FEBRUARY",
    MARCH = "MARCH",
    APRIL = "APRIL",
    MAY = "MAY",
    JUNE = "JUNE",
    JULY = "JULY",
    AUGUST = "AUGUST",
    SEPTEMBER = "SEPTEMBER",
    OCTOBER = "OCTOBER",
    NOVEMBER = "NOVEMBER",
    DECEMBER = "DECEMBER"
}

export interface IOperatingLineItem extends RootDocument {
    name: string;
    cost: number
}

export interface IOperatingBudget extends RootDocument {
    month: Month;
    year: number;
    lineItems: IOperatingLineItem[];
}
const OperatingBudgetSchema = new mongoose.Schema({
    month: String,
    year: Number,
    lineItems: [{
        name: String,
        cost: Number
    }]
});
export const OperatingBudget = mongoose.model<IOperatingBudget & mongoose.Document>("OperatingBudget", OperatingBudgetSchema);