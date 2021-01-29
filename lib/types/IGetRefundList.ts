import { IDateFilter, IRefundStatus } from ".";

export interface IGetRefundList {
    created_at?: IDateFilter;
    payment_id?: string;
    status?: IRefundStatus;
    limit?: number;
    cursor?: string;
}