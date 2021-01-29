import {
    IAirlineWithoutId,
    IAmount,
    IReceipt,
    ITransferWithoutStatus
} from ".";

export interface ICapturePayment {
    amount: IAmount;
    airline?: IAirlineWithoutId;
    transfers?: ITransferWithoutStatus[];
    receipt?: IReceipt;
}