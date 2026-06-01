import { createTheme } from '@mui/material/styles';
import themeSpec from './theme-master-spec.json';

const { schemes, coreColors } = themeSpec;
const light = schemes.light;
const dark = schemes.dark;

// Flow custom colors from extendedColors
const getExtendedColor = (name: string) => {
    const color = themeSpec.extendedColors.find(c => c.name === name);
    return color?.color || '#000000';
};

export const flowColors = {
    block: {
        morning: {
            light: getExtendedColor('block-morning-light'),
            dark: getExtendedColor('block-morning-dark'),
        },
        afternoon: {
            light: getExtendedColor('block-afternoon-light'),
            dark: getExtendedColor('block-afternoon-dark'),
        },
        evening: {
            light: getExtendedColor('block-evening-light'),
            dark: getExtendedColor('block-evening-dark'),
        },
        night: {
            light: getExtendedColor('block-night-light'),
            dark: getExtendedColor('block-night-dark'),
        },
    },
    weight: {
        quick: {
            light: getExtendedColor('weight-quick-light'),
            dark: getExtendedColor('weight-quick-dark'),
        },
        focused: {
            light: getExtendedColor('weight-focused-light'),
            dark: getExtendedColor('weight-focused-dark'),
        },
        deep: {
            light: getExtendedColor('weight-deep-light'),
            dark: getExtendedColor('weight-deep-dark'),
        },
    },
};

export const muiTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: light.primary,
            contrastText: light.onPrimary,
            light: light.primaryContainer,
            dark: coreColors.primary,
        },
        secondary: {
            main: light.secondary,
            contrastText: light.onSecondary,
            light: light.secondaryContainer,
        },
        error: {
            main: light.error,
            contrastText: light.onError,
            light: light.errorContainer,
        },
        background: {
            default: light.background,
            paper: light.surface,
        },
        text: {
            primary: light.onBackground,
            secondary: light.onSurfaceVariant,
        },
        divider: light.outlineVariant,
    },
    typography: {
        fontFamily: '"Inter", system-ui, sans-serif',
        h1: { fontSize: '57px', lineHeight: 1.12, fontWeight: 400 },
        h2: { fontSize: '45px', lineHeight: 1.16, fontWeight: 400 },
        h3: { fontSize: '36px', lineHeight: 1.22, fontWeight: 400 },
        h4: { fontSize: '32px', lineHeight: 1.25, fontWeight: 400 },
        h5: { fontSize: '28px', lineHeight: 1.28, fontWeight: 400 },
        h6: { fontSize: '24px', lineHeight: 1.33, fontWeight: 400 },
        subtitle1: { fontSize: '16px', lineHeight: 1.5, fontWeight: 500 },
        subtitle2: { fontSize: '14px', lineHeight: 1.57, fontWeight: 500 },
        body1: { fontSize: '16px', lineHeight: 1.5, fontWeight: 400 },
        body2: { fontSize: '14px', lineHeight: 1.43, fontWeight: 400 },
        button: { fontSize: '14px', lineHeight: 1.43, fontWeight: 500, textTransform: 'none' },
        caption: { fontSize: '12px', lineHeight: 1.33, fontWeight: 400 },
        overline: { fontSize: '12px', lineHeight: 1.33, fontWeight: 500, textTransform: 'uppercase' },
    },
    shape: {
        borderRadius: 16,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '9999px', // M3 full rounded
                    textTransform: 'none',
                },
            },
        },
        MuiFab: {
            styleOverrides: {
                root: {
                    borderRadius: '16px', // M3 large
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '16px',
                    boxShadow: '0px 1px 3px rgba(0,0,0,0.12)',
                },
            },
        },
    },
});

// Dark theme
export const muiDarkTheme = createTheme({
    ...muiTheme,
    palette: {
        mode: 'dark',
        primary: {
            main: dark.primary,
            contrastText: dark.onPrimary,
            light: dark.primaryContainer,
            dark: coreColors.primary,
        },
        secondary: {
            main: dark.secondary,
            contrastText: dark.onSecondary,
            light: dark.secondaryContainer,
        },
        error: {
            main: dark.error,
            contrastText: dark.onError,
            light: dark.errorContainer,
        },
        background: {
            default: dark.background,
            paper: dark.surface,
        },
        text: {
            primary: dark.onBackground,
            secondary: dark.onSurfaceVariant,
        },
        divider: dark.outlineVariant,
    },
});