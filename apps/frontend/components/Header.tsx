"use client";

import Link from "next/link";
import { HeaderNavigationMenu } from "./HeaderNavigationMenu";
import Image from "next/image";
import { Leaf, ShoppingCart, User } from "lucide-react";
import { ICON_SIZE } from "@/lib/constants";
import { Button } from "./ui/button";
import { useCartStore } from "@/lib/stores/cart-store";

export const Header = () => {
  const items = useCartStore((state) => state.items);
  
  // Derive total count from items
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="w-full border-b flex items-center justify-between px-10 py-2 sticky top-0 bg-white opacity-90 z-10">
      <Link href="/">
        <div className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-primary" size={ICON_SIZE.HEADER} />
          <span className="text-xl font-bold">Vivek's Farm</span>
        </div>
      </Link>
      <HeaderNavigationMenu />
      <div className="flex items-center justify-between">
        <Button variant="ghost">
          <User size={ICON_SIZE.HEADER} />
        </Button>
        <Button variant="ghost" className="relative" asChild>
          <Link href="/cart">
            <ShoppingCart size={ICON_SIZE.HEADER} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </Button>
      </div>
    </div>
  );
};
