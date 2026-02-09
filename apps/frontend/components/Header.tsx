import Link from "next/link";
import { HeaderNavigationMenu } from "./HeaderNavigationMenu";
import Image from "next/image";
import { Icon, ShoppingBasket, ShoppingCart, User } from "lucide-react";
import { ICON_SIZE } from "@/lib/constants";
import { Button } from "./ui/button";

export const Header = () => {
  return (
    <div className="w-full border-b flex items-center justify-between px-10 py-2 sticky top-0 bg-white opacity-90 z-10">
      <Link href="/">
        <Image
          src={"/primary-logo.jpg"}
          alt="Vivek's Farm"
          width={100}
          height={50}
        />
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
