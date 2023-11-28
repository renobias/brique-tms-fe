import { ListFieldDynamicComponent } from "../../components/pages/fieldDynamic/components/list";
import { globalStateContext } from "../../stateProvider";
import { useContext, useEffect } from "react";

export default function ListFieldDynamicPage() {
  // useWebGateSecurity();
  const globalState = useContext(globalStateContext);
  const { currentLayout, setCurrentLayout } = globalState.layout.current;
  useEffect(() => {
    setCurrentLayout("home");
  }, []);
  return <ListFieldDynamicComponent />;
}
