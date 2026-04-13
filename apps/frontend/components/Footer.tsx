import { Leaf, MessageCircle } from "lucide-react";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="w-full border-t bg-secondary/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">Vivek's Farm</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Fresh from our farm to your table. Pure, natural, and handmade with
              love.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary">Home</Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-primary">Shop</Link>
              </li>
              <li>
                <Link href="/about-us" className="hover:text-primary">About</Link>
              </li>
              <li>
                <Link href="/contact-us" className="hover:text-primary">Contact</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Categories</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/shop/ghee" className="hover:text-primary">Ghee</Link>
              </li>
              <li>
                <Link href="/shop/pickles" className="hover:text-primary">Pickles</Link>
              </li>
              <li>
                <Link href="/shop/sweets" className="hover:text-primary">Sweets</Link>
              </li>
              <li>
                <Link href="/shop/honey" className="hover:text-primary">Honey</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Get in Touch</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>+91 98765 43210</p>
              <p>hello@viveksfarm.com</p>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                <MessageCircle className="h-4 w-4" />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Vivek's Farm. All rights reserved.
        </div>
      </div>
    </footer>
  );
};