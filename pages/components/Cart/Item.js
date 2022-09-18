import { Text, Image, Flex } from "@chakra-ui/react";
import { MdRemove, MdAdd } from "react-icons/md";
import { doc, updateDoc, arrayRemove } from "firebase/firestore";
import { auth, db } from "../../_app";

export const removeFromCart = id => {
  if (!auth.currentUser) return;
  const uid = auth.currentUser.uid;
  updateDoc(doc(db, "users", uid), { cart: arrayRemove(id) });
};

export default props => {
  if (!props.product) return <></>;
  return (
    <Flex className="p-1 gap-5 text-base h-min relative">
      <Image src={props.product.images[0]} boxSize={"80px"} />
      <Flex flexDirection={"column"} className="w-full justify-between">
        <Text className="leading-[1]">{props.product.name}</Text>
        <Flex className="gap-2 items-center justify-between">
          <Flex className="gap-1 items-center">
            <MdRemove
              className="border-black border-1 border h-5 w-5 justify-center items-center cursor-pointer rounded-sm shadow"
              onClick={() => removeFromCart(props.product.id)}
            />
            <Text> 1 </Text>
            <MdAdd className="border-grey border-1 border h-5 w-5 justify-center items-center text-grey text-xs rounded-sm shadow" />
          </Flex>
          <span className="text-lg mr-2">
            R$ {props.product.metadata.price}
          </span>
        </Flex>
      </Flex>
    </Flex>
  );
};
