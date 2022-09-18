import { doc, Flex, Box, Text, getDoc, VStack } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Cart from "./components/Cart";
import { auth, db } from "./_app";
import { AiOutlineDownload } from "react-icons/ai";
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import Navbar from "./components/Navbar";

const getHistory = async () => {
  const history = [];
  const uid = auth.currentUser.uid;
  const res = (await getDoc(doc(db, "users", uid))).data().history;
  const api = "/api/getHistory";
  const body = JSON.stringify({ items: res });
  const headers = { "Content-Type": "application/json" };
  const method = "POST";
  const response = await fetch(api, { method, body, headers });
  const result = await response.json();
  return result.items;
};

const Item = props => {
  return (
    <div className="bg-white flex flex-col gap-4 p-5 rounded-md">
      <div className="flex flex-col">
        <a className="flex flex-col gap-2">
          <span className="flex gap-2 items-center">
            <FaLock />
            <b>ID da Transação</b>
            <br />
          </span>
          {props.item.payment_intent}
          <br />
        </a>
      </div>
      <div className="flex justify-between">
        {props.item.payment_status == "paid" ? (
          <a className=" text-green-600 font-bold ">Aprovado</a>
        ) : (
          <a className=" text-red-700 font-bold ">Não Pago</a>
        )}
        <a fontWeight={"bold"}>R$ {props.item.amount_total / 100}</a>
      </div>
    </div>
  );
};

// const UserHistory = () => {
//   const [history, setHistory] = useState([]);

//   useEffect(() => {
//     if (auth.currentUser) getHistory().then(setHistory);
//     else setHistory([]);
//   }, []);

//   return (
//     <div className="flex flex-col gap-5 bg-[#f1f1f1] p-5 rounded">
//       <a className="text-2xl font-bold">Histórico de Compras</a>
//       <Stack>
//         {history.map(item => (
//           <Flex
//             className="bg-white flex-col gap-2 p-5 rounded-md"
//             key={item.id}
//           >
//             <Box>
//               <a className="font-bold">ID da Transação:</a>
//               <a>{item.id}</a>
//             </Box>
//             <Flex justifyContent={"space-between"}>
//               <a className=" text-green-600 font-bold ">Aprovado</a>
//               <a fontWeight={"bold"}>R$ {item.amount / 100}</a>
//             </Flex>
//           </Flex>
//         ))}
//       </Stack>
//     </div>
//   );
// };
const UserHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (auth.currentUser) getHistory().then(setHistory);
    else setHistory([]);
  }, []);

  console.log(history);
  return (
    <div className="flex flex-col gap-5 bg-[#f1f1f1] p-5 rounded">
      <a className="text-2xl font-bold">Histórico de Compras</a>
      <div className="flex flex-col gap-3">
        {history.map(item => (
          <Item item={item} key={item.id} />
        ))}
      </div>
    </div>
  );
};

export default function User() {
  const [user, loading] = useAuthState(auth);
  const [userInfo, setUserInfo] = useState({});
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) router.push("/login");
    }
    if (user) {
      getDoc(doc(db, "users", user.uid)).then(response => setUserInfo(response.data()));
    }
  }, [user]);

  if (!user) return <></>;
  return (
    <>
      <Navbar />
      <div className="p-10 w-full flex flex-col justify-between lg:flex-row gap-10">
        <div className="flex flex-col gap-10">
          <a className="text-3xl">
            Bem-Vindo(a) <br />
            <b>{userInfo.name}</b>
          </a>
          <div className="flex flex-col gap-5">
            <a className="text-2xl font-bold">Informações do Usuário</a>
            <a className="flex gap-2 items-center">
              <MdEmail className="text-2xl" />
              <b>Email</b>: {userInfo.email}
            </a>
            <a className="flex gap-2 items-center">
              <FaLock className="text-2xl" />
              <b>ID</b>: {user.uid}
            </a>
          </div>

          <UserHistory />
        </div>

        <div className="bg-gray h-[75vh] p-5 lg:w-[40vw] rounded">
          <Cart />
        </div>
      </div>
    </>
  );
}
