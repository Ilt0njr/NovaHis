import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import SignIn from "./components/Login/signIn";
import SignUp from "./components/Login/signUp";
import Navbar from "./components/Navbar";
import { auth } from "./_app";

export default function Login() {
  const [user] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    const wait = () => new Promise(res => setTimeout(res, 3000));
    wait().then(() => (auth.currentUser ? router.push("/") : null));
  }, []);

  return (
    <>
      <Navbar />
      {!user && (
        <div className="flex flex-col lg:flex-row w-screen h-full pt-10 gap-10 px-5 justify-around">
          <SignIn />
          <SignUp />
        </div>
      )}
      {user && (
        <div className="h-[90vh] w-full flex justify-center items-center flex-col gap-5">
          <a className="text-3xl font-bold">Parece que você já está em uma conta</a>
          <a>
            Se não for redirecionado automaticamente clique
            <Link href="/">
              <a className="hover:underline text-primary">{" aqui"}</a>
            </Link>
          </a>
        </div>
      )}
    </>
  );
}
