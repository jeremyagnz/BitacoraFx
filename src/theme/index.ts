import { COLORS, SIZES } from '../constants';

export const theme = {
  colors: COLORS,
  spacing: {
    xs: SIZES.SPACING_XS,
    sm: SIZES.SPACING_SM,
    md: SIZES.SPACING_MD,
    lg: SIZES.SPACING_LG,
    xl: SIZES.SPACING_XL,
    xxl: SIZES.SPACING_XXL,
    xxxl: SIZES.SPACING_XXXL,
  },
  borderRadius: {
    sm: SIZES.RADIUS_SM,
    md: SIZES.RADIUS_MD,
    lg: SIZES.RADIUS_LG,
    xl: SIZES.RADIUS_XL,
    round: SIZES.RADIUS_ROUND,
  },
  fontSize: {
    xs: SIZES.FONT_XS,
    sm: SIZES.FONT_SM,
    md: SIZES.FONT_MD,
    lg: SIZES.FONT_LG,
    xl: SIZES.FONT_XL,
    xxl: SIZES.FONT_XXL,
    xxxl: SIZES.FONT_XXXL,
    title: SIZES.FONT_TITLE,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
  },
} as const;

export type Theme = typeof theme;
