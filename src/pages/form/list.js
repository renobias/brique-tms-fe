import { ListFormComponent } from "../../components/pages/form/components/list";
import { globalStateContext } from "../../stateProvider";
import { useContext, useEffect } from "react";

export default function ListFormPage() {
    // useWebGateSecurity();
    const globalState = useContext(globalStateContext);
    const { currentLayout, setCurrentLayout } = globalState.layout.current;
    useEffect(() => {
        setCurrentLayout("home");
    }, []);
    return <ListFormComponent />;
}
