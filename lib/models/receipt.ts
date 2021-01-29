import {
    ICheckoutCustomer,
    IItem,
    IReceiptStatus,
    IReceiptType,
    ISettlement
} from "../types";

export class Receipt {
    id!: string;
    type!: IReceiptType;
    payment_id!: string;
    refund_id!: string;
    customer!: ICheckoutCustomer;
    status!: IReceiptStatus;
    fiscal_document_number!: string;
    fiscal_storage_number!: string;
    fiscal_attribute!: string;
    registered_at!: string;
    fiscal_provider_id!: string;
    tax_system_code!: number;
    items!: IItem[];
    settlements!: ISettlement[];
    on_behalf_of!: string;
    send!: boolean;
    constructor() { }
}

export const receiptFactory = (payload: any): Receipt => {
    return Object.assign(new Receipt(), payload);
};