import { Button, useToast } from "@chakra-ui/react";
import { useState } from "react";
import FormInput from "./FormInput";
import { auth } from "../../_app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";

const blank = { email: "", password: "" };

export default () => {
  const emailReg = /^[a-z0-9.]+@[a-z0-9]+.[a-z]+.([a-z]+)?$/i;
  const [state, setState] = useState(blank);
  const router = useRouter();
  const toast = useToast();

  const setLogin = e => {
    const name = e.target.getAttribute("name");
    setState({ ...state, [name]: e.target.value });
  };

  const toastError = value =>
    toast({
      title: "Erro no Login",
      description: value,
      status: "error",
      isClosable: true,
    });

  const sendLogin = e => {
    e.preventDefault();
    if (!Object.values(state).every(x => x.length > 1))
      return toastError("Preencha todos os campos corretamente");
    if (!emailReg.test(state.email)) return toastError("Email Inválido");
    signInWithEmailAndPassword(auth, state.email, state.password).then(() => router.push("/"));
  };

  return (
    <form
      className="flex flex-col gap-10 bg-[#f1f1f1] p-10 rounded h-max"
      onSubmit={sendLogin}
    >
      <a className="font-bold text-xl">Entrar</a>
      <div className="flex flex-col gap-5 ">
        <FormInput p="Email" v={state} onChange={setLogin} name="email" />
        <FormInput p="Sua Senha" v={state} onChange={setLogin} name="password" t="password" />
      </div>
      <Button variant="primary" type="submit">
        Entrar
      </Button>
    </form>
  );
};
