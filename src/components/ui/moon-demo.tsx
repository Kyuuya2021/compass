import { MoonIcon } from "./moon";
import { SunIcon } from "./sun";

const MoonDemo = () => {
  return (
    <div className="flex items-center justify-center min-h-[200px] bg-background space-x-4">
      <div className="text-center">
        <MoonIcon />
        <p className="text-sm text-muted-foreground mt-2">Moon Icon</p>
      </div>
      <div className="text-center">
        <SunIcon />
        <p className="text-sm text-muted-foreground mt-2">Sun Icon</p>
      </div>
    </div>
  );
};

export { MoonDemo }; 