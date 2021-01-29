import { Receipt } from "../models";
import { IBaseList } from ".";

export interface IReceiptList extends IBaseList {
    items: Receipt[];
}