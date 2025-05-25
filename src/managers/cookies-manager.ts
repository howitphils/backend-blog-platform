enum CookieTTL {
  ONE_DAY = 24 * 60 * 60 * 1000, // 1 день в милисекундах
  SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000, // 7 дней в милисекундах
  THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000, // 30 дней в милисекундах
}

export const cookieService = {
  refreshTokenCookieOptions: {
    httpOnly: true,
    secure: true,
    path: "/auth",
    sameSite: "lax",
    maxAge: CookieTTL.SEVEN_DAYS,
  },
};
