import { useRouter } from "next/router";
import { MdOutlineSearch } from "react-icons/md";
import { useState } from "react";
import { Spinner } from "@chakra-ui/react";

export default () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = e => {
    if (e.key === "Enter") {
      setLoading(true);
      router
        .push(
          {
            pathname: "/search",
            query: { ...router.query, search: e.target.value },
          },
          undefined,
          {
            shallow: true,
          }
        )
        .then(() => setLoading(false));
    }
  };

  return (
    <div className="bg-[#f1f1f1] flex items-center px-5 rounded-full py-2 my-3">
      <input
        className="bg-transparent w-full outline-none text-md"
        placeholder="Buscar"
        onKeyDown={handleSearch}
        onChange={e => setSearch(e.target.value)}
        value={search}
      />
      {!loading && (
        <MdOutlineSearch
          className="text-2xl cursor-pointer"
          onClick={handleSearch}
        />
      )}
      {loading && <Spinner speed="0.65s" emptyColor="gray.200" />}
    </div>
  );
};
