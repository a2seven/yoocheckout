import { ICheckoutCustomer, IItemWithoutData } from ".";

export interface IReceipt {
    customer?: ICheckoutCustomer;
    items: IItemWithoutData[];
    tax_system_code?: number;
    phone: string;
    email: string;
}