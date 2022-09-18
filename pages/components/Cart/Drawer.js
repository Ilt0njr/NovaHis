import { BsFillHandbagFill } from "react-icons/bs";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Button,
  Center,
} from "@chakra-ui/react";
import Payment from "../Payment";

export default props => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const UserWithoutItems = () => (
    <div className="h-full w-full flex justify-center items-center flex-col gap-10">
      <BsFillHandbagFill className="text-9xl" />
      <Center className="flex-col gap-5">
        <a className="text-xl text-grey">Parece que não há nada por aqui.</a>
        <Button colorScheme="brand" onClick={onClose}>
          Ir Às Compras
        </Button>
      </Center>
    </div>
  );

  const NoUser = () => (
    <div className="h-full w-full flex justify-center items-center flex-col gap-10">
      <BsFillHandbagFill className="text-9xl" />
      <Center className="flex-col gap-5">
        <a className="text-xl text-grey text-center">
          Entre em uma conta para começar as compras.
        </a>
      </Center>
    </div>
  );

  return (
    <>
      <div className="flex items-center cursor-pointer">
        <BsFillHandbagFill onClick={onOpen} />
      </div>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size={["full", "sm"]}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader fontSize={"2rem"} textAlign={"center"}>
            Sua Sacola
          </DrawerHeader>
          <DrawerBody marginTop={5}>
            {props.type == "NoUser" && <NoUser />}
            {props.type == "UserWithout" && <UserWithoutItems />}
            {props.type == "UserWith" && props.children}
          </DrawerBody>
          <DrawerFooter>{props.type == "UserWith" && <Payment />}</DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};
