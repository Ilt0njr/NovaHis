import Stripe from "stripe";
import { useRouter } from "next/router";
import Navbar from "./components/Navbar/index";
import Card from "./components/Card";
import { useState, useEffect } from "react";
import MobileSearchMenu from "./components/Search/MobileSearchMenu";
import SearchMenu from "./components/Search/SearchMenu";

export default function Search({ categorys, products, productsByType }) {
  const [activeProducts, setActiveProducts] = useState([]);
  const router = useRouter();
  const { search } = router.query;
  const min = router.query.min ? router.query.min : null;
  const max = router.query.max ? router.query.max : null;
  const types = router.query.types
    ? typeof router.query.types == "string"
      ? [router.query.types]
      : router.query.types
    : [];

  useEffect(() => {
    let query = products;
    const getSearch = products =>
      products.filter(i =>
        Object.values(i.metadata)
          .map(j => j.toLowerCase().includes(search.toLowerCase()))
          .includes(true)
      );

    if (productsByType) {
      if (types.length > 0) {
        query = types.map(i => productsByType[i]).flat(2);
      }
    }
    if (search) {
      query = getSearch(query);
    }

    if (min != null) {
      query = query.filter(i => parseFloat(i.metadata.price) >= min);
    }
    if (max != null) {
      query = query.filter(i => parseFloat(i.metadata.price) <= max);
    }

    setActiveProducts(query);
  }, [router.query]);

  return (
    <>
      <Navbar>
        <MobileSearchMenu categorys={categorys} />
      </Navbar>

      <div className="flex ">
        <div className="hidden lg:block">
          <SearchMenu categorys={categorys} />
        </div>
        <div className="flex gap-20 w-full justify-center flex-wrap m-5">
          {activeProducts.map(i => (
            <Card product={i} key={i.id} />
          ))}
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const stripe = new Stripe(process.env.STRIPE_PRIVATEKEY);
  const response = await stripe.products.search({ query: "active:'true'" });
  const products = response.data;
  const categorys = products.map(x => x.metadata.type);

  const productsByType = {};
  products.forEach(i => {
    productsByType[i.metadata.type] =
      productsByType[i.metadata.type] == undefined
        ? [i]
        : [...productsByType[i.metadata.type], i];
  });

  return {
    props: {
      products,
      categorys,
      productsByType,
    },
  };
}
