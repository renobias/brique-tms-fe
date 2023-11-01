import { globalStateContext } from "../../stateProvider";
import { useContext, useEffect } from "react";
import { HomePageComponent } from "../../components/pages/home";

export default function Index() {
    const globalState = useContext(globalStateContext);
    const { currentLayout, setCurrentLayout } = globalState.layout.current;
    useEffect(() => {
      setCurrentLayout("home");
    }, []);
  
    return <HomePageComponent />;
  }
  