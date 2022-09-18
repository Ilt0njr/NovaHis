import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Input,
  FormControl,
  FormLabel,
  Box,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { auth, db } from "../../_app";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";

const blank = {
  CEP: "",
  localidade: "",
  logradouro: "",
  bairro: "",
  uf: "",
  n: "",
  validCEP: false,
};

const getPrices = async userId => {
  const userResponse = await getDoc(doc(db, "users", userId));
  const api = "/api/getCart";
  const body = JSON.stringify({ items: userResponse.data().cart });
  const headers = { "Content-Type": "application/json" };
  const method = "POST";
  const response = await fetch(api, { method, body, headers });
  const result = await response.json();
  return result.items.map(x => x.default_price);
};

const getShippingOptions = async (CEP, N) => {
  const url = "https://melhorenvio.com.br/api/v2/me/shipment/calculate";
  const packageDim = { weight: 5, width: 10, height: 10, length: 17 };
  const from = { postal_code: "88132530", number: "59" };
  const to = { postal_code: CEP, number: N };
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_MELHOR_ENVIO_TOKEN}`,
    },
    body: JSON.stringify({ from, to, packageDim }),
  });
  const result = await response.json();
  return result.filter(x => !x.error && x.company.name == "Correios");
};

const writeSessionInUserAccount = async id =>
  await updateDoc(doc(db, "users", auth.currentUser.uid), {
    history: arrayUnion(id),
  });

const getSession = async adress => {
  if (!adress.validCEP) return "CEP Inválido";
  if (!Object.values(adress).every(i => i.length != 0))
    return "Campos Inválidos";

  const key =
    "pk_test_51LN5o2KXtzChd66U4NEyjhrqOeECpypHKrRlOh7m8NEK4wYbqkOG8K5Cna0zwYIO2edPK38slHPtZ3lU5vAbhDl400fFXl6JFq";
  const stripe = await loadStripe(key);
  const prices = await getPrices(auth.currentUser.uid);
  const shippingOptions = await getShippingOptions(adress.CEP, adress.n);

  const response = await fetch("/api/payment", {
    method: "POST",
    body: JSON.stringify({
      prices,
      shipping: shippingOptions[0],
    }),
    headers: { "Content-Type": "application/json" },
  });
  const result = await response.json();
  await writeSessionInUserAccount(result.session.id);
  stripe.redirectToCheckout({ sessionId: result.session.id });
};

export default props => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [adress, setAdress] = useState(blank);
  const toast = useToast();
  const save = e =>
    setAdress({ ...adress, [e.target.getAttribute("name")]: e.target.value });

  useEffect(() => {
    adress.CEP.length == 8
      ? fetch(`https://viacep.com.br/ws/${adress.CEP}/json/`)
          .then(response => response.json())
          .then(result => {
            const { localidade, logradouro, bairro, uf } = result;
            setAdress({
              ...adress,
              localidade,
              logradouro,
              bairro,
              uf,
              validCEP: true,
            });
          })
      : adress.validCEP != false
      ? setAdress({ ...adress, validCEP: false })
      : null;
  }, [adress.CEP]);

  const toastError = value =>
    toast({
      title: "Erro na Validação",
      description: value,
      status: "error",
    });

  const handle = async () => {
    setLoading(true);
    const response = await getSession(adress);
    if (response) toastError(response);
    setLoading(false);
  };

  return (
    <>
      <Button onClick={onOpen} variant="primary">
        Finalizar Compra
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Finalizar Compra</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {loading ? (
              <div className="flex justify-center items-center h-[30vh] w-[100%]">
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="primary"
                  size="xl"
                />
              </div>
            ) : (
              <FormControl className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-max mt-3">
                <Box>
                  <FormLabel>CEP</FormLabel>
                  <Input
                    placeholder="CEP"
                    name="CEP"
                    onChange={save}
                    value={adress.CEP}
                    type="number"
                  />
                </Box>
                <Box>
                  <FormLabel>Estado</FormLabel>
                  <Input
                    placeholder="SC"
                    name="uf"
                    onChange={save}
                    value={adress.uf}
                  />
                </Box>
                <Box>
                  <FormLabel>Cidade</FormLabel>
                  <Input
                    placeholder="Cidade"
                    name="localidade"
                    onChange={save}
                    value={adress.localidade}
                  />
                </Box>
                <Box>
                  <FormLabel>Bairro</FormLabel>
                  <Input
                    placeholder="Bairro"
                    name="bairro"
                    onChange={save}
                    value={adress.bairro}
                  />
                </Box>
                <Box>
                  <FormLabel>Rua</FormLabel>
                  <Input
                    placeholder="Rua."
                    name="logradouro"
                    onChange={save}
                    value={adress.logradouro}
                  />
                </Box>
                <Box>
                  <FormLabel>Número</FormLabel>
                  <Input
                    placeholder="Nº"
                    name="n"
                    onChange={save}
                    value={adress.n}
                    type="number"
                  />
                </Box>

                <Box className="mt-5 mb-2 w-full flex justify-between lg:col-span-2">
                  {loading && (
                    <Spinner
                      thickness="4px"
                      speed="0.65s"
                      color="brand.500"
                      size="lg"
                      emptyColor="gray.200"
                    />
                  )}
                </Box>
              </FormControl>
            )}
          </ModalBody>

          <ModalFooter>
            <div className="flex gap-5">
              <Button variant="ghost">Cancelar</Button>
              <Button variant="primary" onClick={handle}>
                Próximo
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
