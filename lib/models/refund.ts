import {
    IAmount,
    IReceipt,
    IRefundStatus,
    ISource
} from "../types";

export class Refund {
    id!: string;
    payment_id!: string;
    status!: IRefundStatus;
    created_at!: string;
    amount!: IAmount;
    description!: string;
    sources!: ISource[];
    receipt?: IReceipt;
    constructor() { }
}


export const refundFactory = (payload: any): Refund => {
    return Object.assign(new Refund(), payload);
};