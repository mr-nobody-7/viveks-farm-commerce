import Link from "next/link";
import { HeaderNavigationMenu } from "./HeaderNavigationMenu";
import Image from "next/image";
import { Icon, Leaf, ShoppingBasket, ShoppingCart, User } from "lucide-react";
import { ICON_SIZE } from "@/lib/constants";
import { Button } from "./ui/button";

export const Header = () => {
  return (
    <div className="w-full border-b flex items-center justify-between px-10 py-2 sticky top-0 bg-white opacity-90 z-10">
      <Link href="/">
        <div className="flex items-center gap-2">
         <Leaf className="h-6 w-6 text-primary"  size={ICON_SIZE.HEADER}/>
          <span className="text-xl font-bold">Vivek's Farm</span>
        </div>
      </Link>
      <HeaderNavigationMenu />
      <div className="flex items-center justify-between">
        <Button variant="ghost">
          <User size={ICON_SIZE.HEADER}  />
        </Button>
        <Button variant="ghost">
          <ShoppingCart size={ICON_SIZE.HEADER} />
        </Button>
      </div>
    </div>
  );
};
