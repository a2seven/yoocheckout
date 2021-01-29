import {
    IDateFilter,
    IPaymentMethodType,
    IPaymentStatus
} from ".";

export interface IGetPaymentList {
    created_at?: IDateFilter;
    captured_at?: IDateFilter;
    payment_method?: IPaymentMethodType;
    status?: IPaymentStatus;
    limit?: number;
    cursor?: string;
}