import { auth, signIn, signOut } from "~/server/auth";

export default async function Home() {
  const session = await auth();
  console.log(`SESSION:`, session);

  if (!session) {
    return (
      <form
        action={async () => {
          "use server";
          signIn("credentials", {
            redirect: false,
            username: "user",
            password: "123456",
          });
        }}
      >
        <button className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20">
          Login
        </button>
      </form>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-2x text-center">
        {session && (
          <span>
            Logged in as {session?.user?.email} {JSON.stringify(session.user)}
          </span>
        )}
      </p>

      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20">
          Sign out
        </button>
      </form>
    </div>
  );
}
