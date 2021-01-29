import { Refund } from "../models";
import { IBaseList } from ".";

export interface IRefundList extends IBaseList {
    items: Refund[];
}