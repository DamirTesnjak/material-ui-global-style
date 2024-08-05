import { componentName } from "../methods/componentName";
import { CssSelectorItemListArgs } from "../types/CssSelectorItemListArgs";

export function ThemeStyleOverrideObject(props: { args: CssSelectorItemListArgs }) {
    const { args } = props;

    const {
        muiCssSelectors,
        muiCssSelector,
        jsonDisplayAsHTML,
    } = args;
    if (muiCssSelectors[muiCssSelector]) {
        const componentNameString = componentName(muiCssSelector);
        const componentCssSelectors: string[] = Object.values(muiCssSelectors[muiCssSelector])

        const componentCssSelectorsFiltered = componentCssSelectors.filter((className) => className.includes(componentNameString));

        const componentMuiName = componentCssSelectorsFiltered[0].split("-")[0];

        const styleOverrides = componentCssSelectorsFiltered.map((classKey) => {
            const styleOverrideProp = classKey.split(`Mui${componentNameString}-`)[1];
            return (
                <div>
                    <span style={{ color: "#e67300" }}>{`${styleOverrideProp}: `}</span><span>{"{}"}</span>
                </div>
            )
        });

        return (
            <div style={{ fontSize: '13px' }}>
                <div style={{ paddingLeft: '0px' }}>{`{`}</div>
                <div style={{ paddingLeft: '20px' }}><span style={{ color: "#e67300" }}>{`${componentMuiName}: `}</span><span>{"{"}</span></div>
                <div style={{ paddingLeft: '40px' }}><span style={{ color: "#e67300" }}>{`defaultProps `}</span><span>{"{"}</span></div>
                <div style={{ paddingLeft: '60px' }}>{jsonDisplayAsHTML}</div>
                <div style={{ paddingLeft: '40px' }}>{`},`}</div>
                <div style={{ paddingLeft: '40px' }}><span style={{ color: "#e67300" }}>{`styleOverrides `}</span><span>{"{"}</span></div>
                <div style={{ paddingLeft: '60px' }}>{styleOverrides}</div>
                <div style={{ paddingLeft: '40px' }}>{`}`}</div>
                <div style={{ paddingLeft: '20px' }}>{`}`}</div>
                <div>{`}`}</div>
            </div>
        )

    }
}