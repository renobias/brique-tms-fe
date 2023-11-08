import { ListCategoryMasterComponent } from "../../../components/pages/master/category/components/list";
import { globalStateContext } from "../../../stateProvider";
import { useContext, useEffect } from "react";

export default function ListCategoryMasterPage() {
  // useWebGateSecurity();
  const globalState = useContext(globalStateContext);
  const { currentLayout, setCurrentLayout } = globalState.layout.current;
  useEffect(() => {
    setCurrentLayout("home");
  }, []);
  return <ListCategoryMasterComponent />;
}
