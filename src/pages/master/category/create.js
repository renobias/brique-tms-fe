import { CreateCategoriesComponent } from "../../../components/pages/master/category/components/create";
import { globalStateContext } from "../../../stateProvider";
import { useContext, useEffect } from "react";

export default function CreateCategoriesMasterPage() {
  // useWebGateSecurity();
  const globalState = useContext(globalStateContext);
  const { currentLayout, setCurrentLayout } = globalState.layout.current;
  useEffect(() => {
    setCurrentLayout("home");
  }, []);
  return <CreateCategoriesComponent />;
}
