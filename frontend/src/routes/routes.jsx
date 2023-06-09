import { Route, useLocation, Switch } from "react-router-dom";
import Splash from "./splash";
import Cardapio from "./cardapio/cardapio";
import { Header } from "../components";

// Todas as rotas do aplicativo
export const ROTAS = [
  [Splash.rota, Splash],
  [Cardapio.rota, Cardapio],
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
