export const Routes = {
  home: {
    default: "/",
  },
  auth: {
    signin: "/signin",
    signup: "/signup",
    signout: "/signout",
  },
  detail: {
    default: (id: number) => `/detail/${id}`,
  },
  setting: {
    default: "/setting",
  },
  notFound: {
    default: "/404",
  },
  serverError: {
    default: "/500",
  },
};
