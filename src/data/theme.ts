type Theme = {
    sizes: {
        touchableHeight: number,
        iconSize: number,
        titleSize: number,
    },
    fonts: {
        bold: string;
        semibold: string;
        medium: string;
        regular: string;
    },
    colors: {
        generic: {
            buttonBackgroundColor: string;
            infoBacgroundColor: string,
            infoTextColor: string,
            successBackgroundColor: string;
            successTextColor: string;
        },
        getStarted: {
            textColor: string,
            infoBacgroundColor: string,
            infoTextColor: string,
            warningBackgroundColor: string,
            warningTextColor: string,
        },
        editor: {
            text: string;
            border: string;
            run: string;
            savedBackgroundColor: string,
            savedTextColor: string,
            savingBackgroindColor: string,
            savingTextColor: string
        },
        sidebar: {
            textColor: string;
            backgroundColor: string;
            iconColor: string;
            textInputBackgroundColor: string;
            inputTextColor: string;
            textMatchFound: string;
        },
        modal: {
            backgroundColor: string,
            titleColor: string,
            subtitleColor: string,
            inputTextBackgroundColor: string,
            inputTextColor: string,
            inputTextBorderColor: string,
        }
    },
    spacing: {
        [id: string]: number;
    }
}

export const theme: Theme = {
    fonts: {
        bold: "Bold",
        semibold: "SemiBold",
        medium: "Medium",
        regular: "Regular"
    },
    sizes: {
        touchableHeight: 40,
        iconSize: 20,
        titleSize: 30
    },
    colors: {
        generic: {
            buttonBackgroundColor: "#111727",
            infoBacgroundColor: "#cfdefe",
            infoTextColor: "#3f77e1",
            successBackgroundColor: "#e3f2ee",
            successTextColor: "#3e6c58"
        },
        getStarted: {
            textColor: "#111727",
            infoBacgroundColor: "#eef9fd",
            infoTextColor: "#193c47",
            warningBackgroundColor: "#fff8e6",
            warningTextColor: "#4d3800",
        },
        editor: {
            text: "#000312",
            border: "#e8e8e8",
            run: "#111727",
            savedBackgroundColor: "",
            savedTextColor: "",
            savingBackgroindColor: "",
            savingTextColor: ""
        },
        sidebar: {
            textColor: "#ffffff",
            backgroundColor: "#111727",
            iconColor: "#ffffff",
            textInputBackgroundColor: "#343b48",
            inputTextColor: "#d4d9e3",
            textMatchFound: "#00abfb"
        },
        modal: {
            backgroundColor: "#ffffff",
            titleColor: "#000000",
            subtitleColor: "#555459",
            inputTextBackgroundColor: "#fafcfe",
            inputTextColor: "#727374",
            inputTextBorderColor: "#e9ebef",
        }
    },
    spacing: {
        s1: 4,
        s2: 8,
        s4: 16,
        s8: 32,
        s16: 64,
    }
}
