/**
 * Font configuration for Ennie
 *
 * To set up fonts:
 * 1. Download Syne and DM Sans from Google Fonts
 * 2. Place .ttf files in /assets/fonts/
 * 3. Required files:
 *    - Syne-Bold.ttf
 *    - Syne-ExtraBold.ttf
 *    - DMSans-Regular.ttf
 *    - DMSans-Medium.ttf
 *    - DMSans-SemiBold.ttf
 *    - DMSans-Bold.ttf
 *
 * The app will fallback to system fonts if these aren't available.
 */

export const fontFamily = {
  heading: 'Syne-Bold',
  headingBold: 'Syne-ExtraBold',
  body: 'DMSans-Regular',
  bodyMedium: 'DMSans-Medium',
  bodySemiBold: 'DMSans-SemiBold',
  bodyBold: 'DMSans-Bold',
};

// Safe font getter that falls back to system fonts
export const getFont = (name) => {
  try {
    return fontFamily[name] || 'System';
  } catch {
    return 'System';
  }
};
