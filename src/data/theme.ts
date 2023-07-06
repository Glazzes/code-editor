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
            tabTitle: string;
            text: string;
            border: string;
            run: string;
            savedBackgroundColor: string,
            savedTextColor: string,
            savingBackgroindColor: string,
            savingTextColor: string,
            footerIconColor: string
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
            infoTextColor: "#233037",
            successBackgroundColor: "#82c185",
            successTextColor: "#447542"
        },
        getStarted: {
            textColor: "#a8aaac",
            infoBacgroundColor: "#c2dbe9",
            infoTextColor: "#193c47",
            warningBackgroundColor: "#ffffff",
            warningTextColor: "#464646",
        },
        editor: {
            tabTitle: "#ffffff",
            text: "#000312",
            border: "#292b2d",
            run: "#2c55fb",
            savedBackgroundColor: "",
            savedTextColor: "",
            savingBackgroindColor: "",
            savingTextColor: "",
            footerIconColor: "#fff"
        },
        sidebar: {
            textColor: "#ffffff",
            backgroundColor: "#292c2d",
            iconColor: "#ffffff",
            textInputBackgroundColor: "#3c4041",
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
