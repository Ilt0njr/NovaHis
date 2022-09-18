import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { Button, Input, FormLabel, Tag, useToast, Select, Spinner } from "@chakra-ui/react";
import { auth } from "./_app";

const blankInfo = {
  name: "",
  price: "",
  description: "",
  type: "",
  state: "",
  chips: [],
  size: "",
};

const getId = () => {
  const date = new Date();
  return (
    "" +
    date.getDate() +
    date.getMonth() +
    date.getFullYear() +
    date.getHours() +
    date.getMinutes() +
    date.getSeconds()
  );
};

const LoginFormItem = props => (
  <div>
    <FormLabel>{props.title}</FormLabel>
    <Input
      placeholder={props.title}
      value={props.obj[props.name]}
      onChange={props.onChange}
      name={props.name}
    />
  </div>
);

export default () => {
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [images, setImages] = useState([]);
  const [info, setInfo] = useState(blankInfo);
  const saveInfo = e => setInfo({ ...info, [e.target.getAttribute("name")]: e.target.value });
  const ImagesPreview = images.map(i => URL.createObjectURL(i));
  const toast = useToast();

  useEffect(() => {
    auth.onAuthStateChanged(user =>
      user
        ? setIsAdmin(auth.currentUser.uid == "BqLeifsO87hPtnw7WpQsHnq6FZs2" ? true : false)
        : setIsAdmin(false)
    );
  }, []);

  const chipKeyDown = e => {
    if (e.key == "Enter") {
      setInfo({
        ...info,
        chips: [...info.chips, e.target.value.replace(" ", "-")],
      });
      e.target.value = "";
    }
  };

  const sendProduct = async () => {
    console.log(info);
    if (!Object.values(info).every(i => i.length > 0))
      return toast({
        title: "Produto não adicionado",
        description: "Preencha todos os campos corretamente",
        status: "error",
      });
    if (!images.length)
      return toast({
        title: "Produto não adicionado",
        description: "Cada produto deve conter pelo menos uma imagem",
        status: "error",
      });

    setLoading(true);
    const id = getId();
    const urls = [];
    for (const i in images) {
      const reference = ref(getStorage(), `${id}/${i}.jpg`);
      const upload = await uploadBytes(reference, images[i]);
      console.log(upload);
      const url = await getDownloadURL(reference);
      console.log(url);
      urls.push(url);
    }
    const api = "/api/addProduct";
    const body = JSON.stringify({ images: urls, info: { ...info } });
    const method = "POST";
    const headers = { "Content-Type": "application/json" };
    const response = await fetch(api, { method, body, headers });
    const result = await response.json();

    if (result.success) {
      toast({
        title: "Sucesso!!!",
        description: "Produto adicionado com sucesso",
        status: "success",
      });
      setInfo(blankInfo);
      setImages([]);
    } else {
      toast({
        title: "Erro",
        description: result.error.message,
        status: "error",
      });
    }

    setLoading(false);
  };

  if (!isAdmin) return;

  return (
    <>
      <Navbar />
      <div className="flex flex-col lg:flex-row gap-10 my-20 mx-5 w-full items-center justify-center">
        <div className="flex flex-col gap-10 justify-center items-center">
          <div className="overflow-x-scroll flex w-48 h-48 lg:w-96 lg:h-96">
            {ImagesPreview.map(i => (
              <img src={i} key={i} />
            ))}
          </div>
          <input
            type="file"
            onChange={e => setImages(Object.values(e.target.files))}
            multiple={true}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-center">
          <LoginFormItem name="name" title="Nome" onChange={saveInfo} obj={info} />
          <LoginFormItem name="price" title="Valor" onChange={saveInfo} obj={info} />
          <div>
            <FormLabel>Estado</FormLabel>
            <Select
              placeholder="Estado"
              onChange={x => setInfo({ ...info, state: x.target.value })}
            >
              <option value="Novo">Novo</option>
              <option value="Ótimo">Ótimo</option>
              <option value="Bom">Bom</option>
            </Select>
          </div>
          <LoginFormItem name="type" title="Categoria" onChange={saveInfo} obj={info} />
          <LoginFormItem name="description" title="Medidas" onChange={saveInfo} obj={info} />

          <div>
            <FormLabel>Tamanho</FormLabel>
            <Select
              placeholder="Tamanho"
              onChange={x => setInfo({ ...info, size: x.target.value })}
            >
              <option value="PP">PP</option>
              <option value="P">P</option>
              <option value="M">M</option>
              <option value="G">G</option>
              <option value="GG">GG</option>
            </Select>
          </div>
          <div>
            <FormLabel fontSize={"1.1rem"} fontWeight="semibold">
              Tags
            </FormLabel>
            <Input placeholder="Tags..." onKeyDown={chipKeyDown} obj={info.chips} />
          </div>

          <div className="flex flex-col gap-5 bg-[#f0f0f0] rounded p-5">
            <a className="text-xl font-bold">Tags:</a>
            <div className="w-80 flex flex-wrap gap-5">
              {info.chips.map(i => (
                <Tag
                  colorScheme="brand"
                  variant="subtle"
                  borderRadius="full"
                  size="lg"
                  key={i}
                >
                  {i.toUpperCase()}
                </Tag>
              ))}
            </div>
          </div>
          {loading ? (
            <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="primary" />
          ) : (
            <Button variant="primary" onClick={sendProduct}>
              Enviar
            </Button>
          )}
        </div>
      </div>
    </>
  );
};
