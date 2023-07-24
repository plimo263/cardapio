import { Route, useLocation, Switch } from "react-router-dom";
import Splash from "./splash";
import Cardapio from "./cardapio/cardapio";
import AdminAcesso from "./admin/admin_acesso";
import { Header } from "../components";
import ManutencaoItens from "./admin/manutencao_itens";
import ImageItemMax from "./cardapio/image-item-max";

// Todas as rotas do aplicativo
export const ROTAS = [
  [Splash.rota, Splash],
  [Cardapio.rota, Cardapio],
  [AdminAcesso.rota, AdminAcesso],
  [ManutencaoItens.rota, ManutencaoItens],
  [ImageItemMax.rota, ImageItemMax],
];

export default function Routes() {
  const location = useLocation();
  return (
    <>
      {location && location.pathname !== "/" && <Header />}
      <Switch location={location} key={location.pathname}>
        {ROTAS.map((ele, idx) => (
          <Route component={ele[1]} exact path={ele[0]} key={idx} />
        ))}
      </Switch>
    </>
  );
}
