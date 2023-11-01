import { DataContext } from "../../contexts/data";
import { useContext } from "react";

export function useDataProvider() {
  const context = useContext(DataContext);

  const handleDataProvider = (dataProviderName) => {
    if (dataProviderName) {
      const dataProvider = context[dataProviderName];
      if (!dataProvider) {
        throw new Error(`"${dataProviderName}" Data provider not found`);
      }
      return context[dataProviderName];
    }
    if (context.default) {
      return context.default;
    } else
      throw new Error(
        `There is no "default" data provider. Please pass dataProviderName.`
      );
  };

  return handleDataProvider;
}
