import { muiCssSelectors } from "../constants/muiCssSelectors";
import { JsonDisplayAsHTML } from "./JsonDisplayAsHTML";

export interface CssSelectorItemListArgs {
    muiCssSelectors: typeof muiCssSelectors & { [x: string]: any; };
    muiCssSelector: string;
    jsonDisplayAsHTML?: JsonDisplayAsHTML;
}