import {
  extendTheme,
  type StyleFunctionProps,
  type ThemeConfig,
} from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  breakpoints: {
    base: "0em", // 0px      (default)
    sm: "30em", // ~480px   (default)
    md: "48em", // ~768px   (default)
    lg: "62em", // ~992px   (default)
    xl: "75em", // ~1200px  (custom)
    "2xl": "96em", // ~1536px  (default)
  },
  colors: {
    primary: "#f25b3d",
    black: "#000",
    white: "#fff",
    transparent: "transparent",
    ldWhiteClear: "#fffefa",
    ldWhiteNeutral: "#FFFDF5", // Background color (light mode)
    ldWhiteBeige: "#f6f2e6",
    ldBlackNight: "#0b0b0a",
    ldBlackJet: {
      100: "#2B2B26",
      300: "#23231F",
      500: "#1A1A17",
      700: "#181815",
      900: "#121210",
    },
    ldGreenDeep: {
      100: "#2E6054",
      300: "#275046",
      500: "#1F4038",
      700: "#1D2D28",
      900: "#1C2420", // Background color (dark mode)
    },
    ldOrange: {
      100: "#f79d8b",
      200: "#f68c77",
      300: "#f57c64",
      400: "#f36b50",
      500: "#f25b3d",
      600: "#da5237",
      700: "#c24931",
      800: "#a9402b",
      900: "#913725",
    },
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: "lg",
        fontWeight: "semibold",
      },
      variants: {
        primary: {
          bg: "primary",
          color: "ldWhiteNeutral",
          _hover: {
            bg: "ldOrange.400",
          },
        },
        secondary: {
          bg: "ldBlackNight",
          boxShadow: "inset 0 0 0 2px #f6f2e6",
          color: "ldWhiteBeige",
          _hover: {
            bg: "ldBlackJet.500",
          },
        },
        "black-outline": {
          bg: "whiteAlpha.900",
          boxShadow: "inset 0 0 0 2px #000",
          color: "black",
          fontWeight: "semibold",
          _hover: {
            bg: "almostWhite",
          },
        },
      },
    },
    Link: {
      baseStyle: {
        _hover: { color: "primary", textDecoration: "none" },
      },
    },
  },
});

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
theme.styles.global = (
  props: Record<string, unknown> | StyleFunctionProps
) => ({
  "html, body": {
    backgroundColor: mode("ldBlackJet.900", "ldBlackJet.500")(props),
    color: mode("ldWhiteBeige", "ldWhiteBeige")(props),
  },
  a: {
    color: "primary",
    _hover: {
      textDecoration: "none",
    },
  },
  nav: {
    backgroundColor: mode("ldBlackNight", "ldBlackJet.900")(props),
  },
  "div.bottom-nav": {
    backgroundColor: mode("ldBlackNight", "ldBlackJet.900")(props),
  },
});

export default theme;
