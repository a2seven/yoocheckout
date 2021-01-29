import { IAmount, IVatDataType } from ".";

export interface IVatData {
    type: IVatDataType;
    amount?: IAmount;
    rate?: string;
}