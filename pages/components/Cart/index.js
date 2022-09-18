import Content from "./Content";
import Drawer from "./Drawer";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { auth, db } from "../../_app";

const getCart = async userId => {
  const userResponse = await getDoc(doc(db, "users", userId));
  const api = "/api/getCart";
  const body = JSON.stringify({ items: userResponse.data().cart });
  const headers = { "Content-Type": "application/json" };
  const method = "POST";
  const response = await fetch(api, { method, body, headers });
  const result = await response.json();
  return result.items;
};

export default props => {
  const [user, loading, error] = useAuthState(auth);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (user) {
      const userId = user.uid;
      const options = { includeMetadataChanges: true };
      const snapFun = () => getCart(userId).then(x => setItems(x));
      snapFun();
      onSnapshot(doc(db, "users", userId), options, snapFun);
    } else setItems([]);
  }, [user]);

  const type = user
    ? items.length > 0
      ? "UserWith"
      : "UserWithout"
    : "NoUser";

  return props.drawer ? (
    <Drawer type={type}>
      <Content user={user} items={items} />
    </Drawer>
  ) : (
    <Content user={user} items={items} />
  );
};
