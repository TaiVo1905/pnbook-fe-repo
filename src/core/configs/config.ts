export const APP_CONFIG = {
  // typography: {
  //   fontFamily: "'Poppins', sans-serif",
  // },
  layout: {
    authContainerWidth: '750px',
    authContainerHeight: '550px',
    authFormMaxWidth: '350px',
  },
} as const;

export type AppConfig = typeof APP_CONFIG;
