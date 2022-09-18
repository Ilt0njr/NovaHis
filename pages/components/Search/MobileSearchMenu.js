import { useRouter } from "next/router";
import { useState } from "react";
import { TbFilter } from "react-icons/tb";
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
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Checkbox,
  CheckboxGroup,
} from "@chakra-ui/react";

const Sliders = props => {
  const { min, setMin, max, setMax } = props;
  const router = useRouter();

  return (
    <div className="flex flex-col gap-3">
      <a className="font-bold">Filtrar por Preço: </a>
      <a>Min.</a>
      <div className="flex gap-5 items-center w-full">
        <Slider
          colorScheme={"brand"}
          defaultValue={min}
          min={0}
          max={100}
          step={5}
          onChange={x => setMin(x)}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>

        <a className="border-b-2 border-primary px-2">{min}</a>
      </div>

      <a>Max.</a>
      <div className="flex gap-5 items-center w-full">
        <Slider
          colorScheme={"brand"}
          defaultValue={max}
          min={0}
          max={100}
          step={5}
          onChange={x => setMax(x)}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>

        <a className="border-b-2 border-primary px-2">{max}</a>
      </div>
    </div>
  );
};

export default props => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { categorys } = props;
  const router = useRouter();
  const [max, setMax] = useState(100);
  const [types, setTypes] = useState([]);
  const [min, setMin] = useState(0);

  const filter = () => {
    router.push(
      { pathname: "/search", query: { ...router.query, types, min, max } },
      undefined,
      {
        shallow: true,
      }
    );
    onClose();
  };

  if (!categorys) return;
  return (
    <>
      <div className="text-3xl cursor-pointer flex items-center justify-center">
        <TbFilter onClick={onOpen} />
      </div>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Filtrar</DrawerHeader>

          <DrawerBody>
            <div className="h-screen p-5 flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <a className="font-bold">Filtrar por Categoria: </a>
                <CheckboxGroup onChange={setTypes}>
                  {categorys.map(i => (
                    <Checkbox value={i} key={i}>
                      {i}
                    </Checkbox>
                  ))}
                </CheckboxGroup>
              </div>

              <Sliders min={min} max={max} setMin={setMin} setMax={setMax} />
            </div>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="brand" onClick={filter}>
              Filtrar
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};
