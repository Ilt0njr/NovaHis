import { Button } from "@chakra-ui/react";
import Link from "next/link";

export default props => {
  const { product } = props;
  if (!product) return;
  return (
    <Link href={`/${product.id}`}>
      <div className="flex flex-col cursor-pointer shrink-0 h-max items-center hover:shadow-lg hover:border-[1px] rounded">
        <img
          src={product.images[0]}
          className="w-56 h-72 object-cover hover:brightness-90 p-5"
        />
        <div className="flex flex-col p-5 gap-2 justify-center items-center">
          <span className="text-md">{product.name}</span>
          <span className="text-end font-semibold font-sans text-xl">
            R$ {product.metadata.price}
          </span>

          <Button colorScheme="brand" className="w-full">
            Ver Mais
          </Button>
        </div>
      </div>
    </Link>
  );
};
