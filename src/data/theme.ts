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
        },
        sidebar: {
            textColor: string;
            backgroundColor: string;
            iconColor: string;
            textInputBackgroundColor: string;
            inputTextColor: string;
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
        touchableHeight: 44,
        iconSize: 20,
        titleSize: 40
    },
    colors: {
        generic: {
            buttonBackgroundColor: "#111727",
        },
        getStarted: {
            textColor: "#111727",
            infoBacgroundColor: "#eef9fd",
            infoTextColor: "#193c47",
            warningBackgroundColor: "",
            warningTextColor: "",
        },
        editor: {
            text: "#000312",
            border: "#f3f3f3",
            run: "#111727"
        },
        sidebar: {
            textColor: "#ffffff",
            backgroundColor: "#111727",
            iconColor: "#ffffff",
            textInputBackgroundColor: "#343b48",
            inputTextColor: "#d4d9e3",
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
