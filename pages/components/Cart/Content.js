import Item from "./Item";
import { BsFillHandbagFill } from "react-icons/bs";
import { Center, Stack, StackDivider } from "@chakra-ui/react";

export default props => {
  const { items, user } = props;

  if (!user)
    return (
      <>
        <a>Entre em uma conta para usar essa funcionalidade</a>
      </>
    );

  if (items.length === 0)
    return (
      <div className="h-full w-full flex justify-center items-center flex-col gap-10">
        <BsFillHandbagFill className="text-9xl" />
        <Center className="flex-col gap-5">
          <a className="text-xl text-grey">Parece que não há nada por aqui.</a>
        </Center>
      </div>
    );

  return (
    <>
      <div className="flex justify-between flex-col h-full">
        <Stack
          spacing={"25px"}
          divider={<StackDivider borderColor="gray.200" />}
        >
          {items.map(i => (
            <Item key={i.id} product={i} />
          ))}
        </Stack>
        <div className="w-full flex flex-col items-end gap-3">
          <Stack className="text-sm text-grey ">
            {items.map(i => (
              <a className="text-end" key={i.id}>
                {i.name}: R${i.metadata.price}
              </a>
            ))}
          </Stack>
          <a className="font-bold">
            Total: R$
            {items.reduce(
              (acc, i) => acc + parseFloat(i.metadata.price.replace(",", ".")),
              0
            )}
          </a>
        </div>
      </div>
    </>
  );
};
