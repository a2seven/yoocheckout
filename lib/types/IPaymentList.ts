import { Payment } from "../models";
import { IBaseList } from ".";

export interface IPaymentList extends IBaseList {
    items: Payment[];
}