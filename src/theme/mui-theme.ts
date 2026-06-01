import { createTheme } from '@mui/material/styles';

// Flow custom colors — доступны через CSS-переменные для кастомных компонентов
export const flowColors = {
    block: {
        morning: 'var(--flow-block-morning)',
        afternoon: 'var(--flow-block-afternoon)',
        evening: 'var(--flow-block-evening)',
        night: 'var(--flow-block-night)',
    },
    weight: {
        quick: 'var(--flow-weight-quick-color)',
        focused: 'var(--flow-weight-focused-color)',
        deep: 'var(--flow-weight-deep-color)',
    },
};

export const muiTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: 'var(--md-sys-color-primary)',
            contrastText: 'var(--md-sys-color-on-primary)',
            light: 'var(--md-sys-color-primary-container)',
            dark: 'var(--md-sys-color-primary)',
        },
        secondary: {
            main: 'var(--md-sys-color-secondary)',
            contrastText: 'var(--md-sys-color-on-secondary)',
            light: 'var(--md-sys-color-secondary-container)',
        },
        error: {
            main: 'var(--md-sys-color-error)',
            contrastText: 'var(--md-sys-color-on-error)',
            light: 'var(--md-sys-color-error-container)',
        },
        background: {
            default: 'var(--md-sys-color-background)',
            paper: 'var(--md-sys-color-surface)',
        },
        text: {
            primary: 'var(--md-sys-color-on-background)',
            secondary: 'var(--md-sys-color-on-surface-variant)',
        },
        divider: 'var(--md-sys-color-outline-variant)',
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
                    borderRadius: '9999px',
                    textTransform: 'none',
                },
            },
        },
        MuiFab: {
            styleOverrides: {
                root: {
                    borderRadius: '16px',
                },
            },
        },
        MuiToggleButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                },
            },
        },
    },
});

export default muiTheme;