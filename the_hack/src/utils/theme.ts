import { defineStyleConfig, extendTheme } from '@chakra-ui/react';
import type { StyleFunctionProps } from '@chakra-ui/styled-system';
import { mode } from '@chakra-ui/theme-tools';
import '@fontsource-variable/urbanist';
import '@fontsource-variable/domine';
import '@fontsource/alfa-slab-one';
import '@fontsource/poppins';
import '@fontsource/rubik-mono-one';


const textBlackColor = '#303030';
const textWhiteColor = '#dadada';

export const themeColors = {
  transparent: 'transparent',
  black: '#000',
  white: '#fff',
  'text-black': textBlackColor,
  'text-white': textWhiteColor,
  primary: {
    main: '#473ff4',
    50: '#fdfdfd',
    100: '#dad9fd',
    200: '#b5b2fb',
    300: '#918cf8',
    400: '#6c65f6',
    500: '#473ff4',
    600: '#3932c3',
    700: '#2b2692',
    800: '#1c1962',
    900: '#0e0d31',
  },
  gray: {
    100: '#dadfe4',
    200: '#a1a3a5',
    300: '#727478',
    400: '#43464b',
    500: '#14181e',
    600: '#101318',
    700: '#0c0e12',
    800: '#080a0c',
    900: '#040506',
  },
};

export const breakpoints = {
  base: '0px',
  xs: '360px',
  st: '375px',
  sm: '480px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  '3xl': '1920px',
  '2k': '2560px',
  '4k': '3840px',
  '8k': '7680px',
};

const theme = extendTheme({
  breakpoints,
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  fonts: {
    body: `'Poppins','Urbanist, sans-serif'`,
    heading: `'Domine Variable', serif`,
    mono: 'Menlo, monospace',
  },
  colors: {
    base: '#F1EFE6',
    link: '#44ffb2',
    breadCrumb: '#B1C7DF',
    ...themeColors,
  },
  styles: {
    global: (props: StyleFunctionProps) => ({
      html: {
        fontFamily: 'Urbanist',
      },
      body: {
        bg: mode('#fff', '#001121')(props),
        fontFamily: 'Urbanist',
      },
      h1: {
        fontSize: '48px',
        fontWeight: 'bold',
      },
      h2: {
        fontSize: '36px',
        fontWeight: 'bold',
      },
      button: {
        color: mode(textBlackColor, textWhiteColor)(props),
      },
      a: {
        color: mode(textBlackColor, textWhiteColor)(props),
      },
      svg: {
        color: mode(textBlackColor, textWhiteColor)(props),
      },
      p: {
        color: mode(textBlackColor, textWhiteColor)(props),
      },
      textarea: {
        color: mode(textBlackColor, textWhiteColor)(props),
        _placeholder: {
          color: mode('gray.200', 'gray.300')(props),
        },
        fontWeight: 600,
      },
      input: {
        color: mode(textBlackColor, textWhiteColor)(props),
        _placeholder: {
          color: mode('gray.200', 'gray.300')(props),
        },
        fontWeight: 600,
      },
    }),
  }
});

export default theme;
