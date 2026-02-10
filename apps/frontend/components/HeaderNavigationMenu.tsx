import Link from "next/link"

import {
  NavigationMenu,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"


export function HeaderNavigationMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
        <Link href="/">Home</Link>
      </NavigationMenuLink>
      <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
        <Link href="/shop">Shop All</Link>
      </NavigationMenuLink>
      <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
        <Link href="/categories">Categories</Link>
      </NavigationMenuLink>
      <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
        <Link href="/about-us">About Us</Link>
      </NavigationMenuLink>
      <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
        <Link href="/contact-us">Contact Us</Link>
      </NavigationMenuLink>
    </NavigationMenu>
  )
}