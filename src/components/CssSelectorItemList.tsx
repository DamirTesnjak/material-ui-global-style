import { ListItem } from "@mui/material";
import { CssSelectorItemListArgs } from "../types/CssSelectorItemListArgs";

export function CssSelectorItemList(props: { args: CssSelectorItemListArgs }) {
    const { args } = props;

    const {
        muiCssSelectors,
        muiCssSelector,
    } = args;

    if (muiCssSelectors[muiCssSelector]) {
        const classNames: string[] = Object.values(muiCssSelectors[muiCssSelector]);
        return classNames.map((className) => {
            return (<ListItem key={className}>{className}</ListItem>)
        })
    }
}