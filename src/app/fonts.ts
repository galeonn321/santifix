import localFont from 'next/font/local';

export const aeonik = localFont({
  src: [
    {
      path: '../../public/fonts/AeonikPro-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/AeonikPro-Medium.woff2',
      weight: '500 700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/AeonikPro-Black.woff2',
      weight: '800 900',
      style: 'normal',
    },
  ],
  variable: '--font-aeonik',
  display: 'swap',
  fallback: ['Arial', 'sans-serif'],
});

export const aeonikCapitalised = localFont({
  src: '../../public/fonts/AeonikPro-Black-Capitalised.woff2',
  weight: '900',
  style: 'normal',
  variable: '--font-aeonik-capitalised',
  display: 'swap',
  fallback: ['Arial Black', 'Arial', 'sans-serif'],
});
