export default () => {
  return (
    <div className="bg-gray p-20 text-lg grid lg:grid-cols-2 justify-between gap-20">
      <div className="flex flex-col gap-5">
        <a className="text-6xl font-bold text-primary">Sobre Nós</a>
        <a>
          O Brechó Nova História nasceu no ano de 2021 após buscarmos por brechós para comprar
          algumas roupas para uma viagem em familia e não encontrarmos nenhum que fosse
          aconchegante e brilhasse os nossos olhos, a partir daquele momento vimos ali uma
          oportunidade de transformar em nosso meio essa visão distorcida que nós mesmos
          criamos de brechós. O nosso sonho é alcançar mulheres de todo o Brasil e fazê-las
          entender que assim como elas poderão dar uma Nova História à peças de roupas que
          seriam descartadas, essas peças farão com que haja uma Nova História em meio à visão
          de cada uma. Brechó é lar de muito amor e de peças raras com um valor riquíssimo de
          Histórias e você pode amá-las tanto quanto nós e dar uma Nova História para cada uma
          delas!
        </a>
      </div>
      <div className="h-[90vh] w-[calc(100%-10vw)] bg-secondary justify-self-end" />
    </div>
  );
};
