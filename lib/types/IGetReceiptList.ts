import { IDateFilter, IReceiptStatus } from ".";

export interface IGetReceiptList {
    created_at?: IDateFilter;
    status?: IReceiptStatus;
    payment_id?: string;
    refund_id?: string;
    limit?: number;
    cursor?: string;
}