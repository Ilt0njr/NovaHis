export default () => {
  return (
    <div className="min-h-64 w-screen bg-primary flex flex-col p-10 lg:flex-row gap-10 justify-between items-center text-white">
      <div className="flex flex-col gap-5 w-[50%]">
        <a className="text-xl font-bold">Sobre</a>
        <a>© 2022 Brechó Nova História Todos os Direitos Reservados</a>
        <a>Created by 41Code</a>
      </div>
      <div className="flex flex-col gap-5 w-[50%]">
        <a className="text-xl font-bold">Contato</a>
        <a>Rua dos Arcanjos, Caminho Novo, Palhoça - SC - CEP 88132530</a>
        <a>(48) 99903-3795</a>
        <a>brechonovahistoria@gmail.com</a>
      </div>
    </div>
  );
};
