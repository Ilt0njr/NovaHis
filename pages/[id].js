import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { Tag, Wrap, useToast, Button } from "@chakra-ui/react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { auth, db } from "./_app";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRef } from "react";
import Head from "next/head";
import Navbar from "./components/Navbar";
import Stripe from "stripe";
import { useRouter } from "next/router";

const ChipsBox = props =>
  props.chips && (
    <Wrap spacing={5} wrap="wrap" direction="row">
      {props.chips.split(" ").map(text => (
        <Tag colorScheme="brand" variant="subtle" size="md" key={text}>
          {text.toUpperCase()}
        </Tag>
      ))}
    </Wrap>
  );

export default ({ product }) => {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  const imagesRef = useRef(null);
  const toast = useToast();

  const toastError = value =>
    toast({
      title: "Erro ao adicionar o produto ao carrinho",
      description: value,
      status: "error",
      isClosable: true,
    });

  const addToCart = () => {
    if (!user) return toastError("Entre em uma conta");
    updateDoc(doc(db, "users", user.uid), {
      cart: arrayUnion(product.id),
    });
  };

  const scrollTo = e => {
    imagesRef.current.scrollLeft =
      (imagesRef.current.scrollWidth / 3) *
      parseInt(e.target.getAttribute("name"));
  };

  const Hr = () => <hr className="w-full mr-20 text-[#aaa]" />;

  return (
    <>
      <Head>
        <title>{product.name}</title>
      </Head>
      <Navbar />
      <div className="flex justify-center">
        <div className="mt-10 flex flex-col lg:flex-row justify-between items-center lg:w-[80vw]">
          <div className="flex lg:flex-row gap-2 justify-center items-center">
            <div className="hidden lg:flex lg:flex-col gap-3  h-min rounded">
              {product.images.map((image, i) => (
                <div
                  className="border-[1px] border-[#a1a1a1] p-3 rounded-md"
                  key={image + "thumb"}
                >
                  <img
                    src={image}
                    className="h-[15vw] lg:h-[5vw] cursor-pointer "
                    name={i}
                    onClick={scrollTo}
                  />
                </div>
              ))}
            </div>
            <div
              ref={imagesRef}
              className="overflow-x-scroll flex w-[70vw] lg:w-[70vh] lg:overflow-x-hidden"
            >
              {product.images.map(image => (
                <img src={image} className="h-[70vw] lg:h-[70vh]" key={image} />
              ))}
            </div>
          </div>
          <div className="flex flex-col text-base px-5 gap-4 lg:h-full py-10 lg:py-0">
            <div className="flex flex-col gap-2">
              <a className="text-2xl font-medium">{product.name}</a>
              <a className="font-thin text-[#777] text-md">Cód: {product.id}</a>
            </div>
            <Hr />

            <ChipsBox chips={product.metadata.chips} />
            <Hr />

            <a>Estado: {product.metadata.state}</a>
            <a className="aspect-square p-2 w-min flex justify-center border-[1px] shadow-sm border-[#aaa] text-grey font-bold rounded">
              {product.metadata.size}
            </a>
            <a className="text-4xl font-bold">R$ {product.metadata.price}</a>
            <Button
              leftIcon={<AiOutlineShoppingCart className="text-2xl" />}
              variant="primary"
              onClick={addToCart}
            >
              Adicionar ao Carrinho
            </Button>
          </div>
        </div>
      </div>
      <div className="mx-10 my-20">
        <a className="text-lg">Descrição: {product.metadata.description}</a>
      </div>
    </>
  );
};

export const getStaticProps = async ({ params }) => {
  const stripe = new Stripe(process.env.STRIPE_PRIVATEKEY);
  const product = await stripe.products.retrieve(params.id);
  return {
    props: { product },
  };
};

export const getStaticPaths = async () => {
  const paths = [];
  const stripe = new Stripe(process.env.STRIPE_PRIVATEKEY);
  const response = await stripe.products.search({ query: "active:'true'" });

  response.data.forEach(item => paths.push({ params: { id: item.id } }));

  return {
    paths,
    fallback: false,
  };
};
