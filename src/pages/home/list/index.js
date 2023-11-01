import { globalStateContext } from "../../../stateProvider";
import { useContext, useEffect } from "react";
import { HomeListComponent } from "../../../components/pages/home/components/list";

export default function Index() {
  const globalState = useContext(globalStateContext);
  const { currentLayout, setCurrentLayout } = globalState.layout.current;
  useEffect(() => {
    setCurrentLayout("home");
  }, []);

  return <HomeListComponent />;
}
