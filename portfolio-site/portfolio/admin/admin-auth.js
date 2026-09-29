/**
 * Basic client-side password gate.
 *
 * This is convenience protection (keeps casual visitors out of /admin),
 * NOT real security — anyone who views this file's source can read the
 * password. Good enough for a personal site where the content isn't
 * sensitive. If you need real protection, put /admin behind a proper
 * login (e.g. a Vercel middleware check, or NextAuth if you migrate this
 * to a Next.js project).
 */
const ADMIN_PASSWORD = "admin123";
const SESSION_KEY = "portfolio_admin_session";
