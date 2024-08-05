import { Dispatch, SetStateAction } from "react";

export interface GetComponentPropsArgs {
    componentClass: string;
    getJsonDisplayAsHTML: Dispatch<SetStateAction<any>>;
}