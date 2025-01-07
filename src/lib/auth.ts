import { currentUser, auth as _auth } from "@clerk/nextjs/server";

export async function auth(options: { withCurrentUser?: boolean } = {}) {
  const session = await _auth();

  if (!session.userId) {
    throw new Error("Unauthorized");
  }

  if (options.withCurrentUser) {
    const user = await currentUser();
    return { session, user };
  }

  return { session };
}
