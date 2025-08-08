import { LoaderIcon } from "lucide-react";
import useThemeStore from "../store/useThemeStore";

const PageLoader = () => {
  const { theme } = useThemeStore();
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      data-theme={theme}
    >
      <LoaderIcon className="animate-spin size-10 text-primary " />
      <span>Loading...</span>
    </div>
  );
};
export default PageLoader;
