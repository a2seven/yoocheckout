import { ICreateError } from "../types";

export class ErrorResponse {
    constructor() {

    }
}


export const errorFactory = (payload: ICreateError): ErrorResponse => {
    return Object.assign(new ErrorResponse(), payload);
};