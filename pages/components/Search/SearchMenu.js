import { useRouter } from "next/router";
import { useState } from "react";
import {
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
          onChange={x => {
            setMin(x);
            router.push(
              {
                pathname: "/search",
                query: { ...router.query, min: x },
              },
              undefined,
              {
                shallow: true,
              }
            );
          }}
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
          onChange={x => {
            setMax(x);
            router.push(
              {
                pathname: "/search",
                query: { ...router.query, max: x },
              },
              undefined,
              {
                shallow: true,
              }
            );
          }}
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
  const { categorys } = props;
  const router = useRouter();
  const [max, setMax] = useState(100);
  const [min, setMin] = useState(0);

  const queryTypes = types =>
    router.push(
      { pathname: "/search", query: { ...router.query, types } },
      undefined,
      {
        shallow: true,
      }
    );

  if (!categorys) return;
  return (
    <>
      <div className="w-[20vw] h-screen p-5 flex flex-col gap-5 bg-[#f1f1f1]">
        <div className="flex flex-col gap-2">
          <a className="font-bold">Filtrar por Categoria: </a>
          <CheckboxGroup onChange={queryTypes}>
            {categorys.map(i => (
              <Checkbox value={i} key={i}>
                {i}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </div>

        <Sliders min={min} max={max} setMin={setMin} setMax={setMax} />
      </div>
    </>
  );
};
