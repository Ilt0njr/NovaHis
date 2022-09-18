import { Button, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import FormInput from "./FormInput";
import { auth, db } from "../../_app";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";

const blank = { name: "", email: "", password: "", password2: "", phone: "" };

export default () => {
  const [state, setState] = useState(blank);
  const toast = useToast();
  const [user, loading, error] = useAuthState(auth);
  const emailReg = /^[a-z0-9.]+@[a-z0-9]+.[a-z]+.([a-z]+)?$/i;
  const router = useRouter();

  const setSignUp = e => {
    const name = e.target.getAttribute("name");
    setState({ ...state, [name]: e.target.value });
  };

  const toastError = value =>
    toast({
      title: "Erro no Cadastro",
      description: value,
      status: "error",
      isClosable: true,
    });

  const sendSignUp = () => {
    const { email, name, password, password2 } = state;
    if (!Object.values(state).every(x => x.length > 1))
      return toastError("Preencha todos os campos corretamente");
    if (!emailReg.test(email)) return toastError("Email Inválido");
    if (password != password2) return toastError("As senhas não correspondem");
    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        setDoc(doc(db, "users", userCredential.user.uid), {
          email,
          name,
          cart: [],
          history: [],
        });
        toast({
          title: "Parabéns",
          description: "Conta criada com sucesso",
          status: "success",
          isClosable: true,
        });
      })
      .then(() => router.push("/"))
      .catch(e => toastError(e.message));
  };

  return (
    <form className="flex flex-col gap-10 bg-[#f1f1f1] p-10 rounded" onSubmit={sendSignUp}>
      <a className="font-bold text-xl">Cadastre-se</a>
      <div className="grid lg:grid-cols-2 gap-5">
        <FormInput p="Nome" v={state} onChange={setSignUp} name="name" t="" />
        <FormInput p="Email" v={state} onChange={setSignUp} name="email" t="email" />
        <FormInput p="Sua Senha" v={state} onChange={setSignUp} name="password" t="password" />
        <FormInput
          p="Confirme Sua Senha"
          v={state}
          onChange={setSignUp}
          name="password2"
          t="password"
        />
        <FormInput p="Telefone" v={state} onChange={setSignUp} name="phone" t="number" />
      </div>
      <Button variant="primary" type={"submit"}>
        Cadastrar
      </Button>
    </form>
  );
};
