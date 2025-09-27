"use client";

import * as React from "react";
import Link from "next/link";
import { ConnectButton } from "@mysten/dapp-kit";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Tableau de Bord",
    href: "/dashboard",
    description: "Accédez à votre tableau de bord d'assurance agricole.",
  },
  {
    title: "Assurance Paramétrique",
    href: "/parametric-insurance",
    description: "Souscrivez une assurance paramétrique avec oracle Nautilus TEE.",
  },
  {
    title: "Dashboard Paramétrique",
    href: "/parametric-dashboard",
    description: "Gérez vos polices paramétriques et surveillez les données oracle.",
  },
  {
    title: "Souscrire une assurance",
    href: "/insurance",
    description: "Souscrivez une nouvelle police d'assurance agricole.",
  },
  {
    title: "Spécifier un champ",
    href: "/field-specification",
    description: "Définissez les spécifications de votre champ agricole.",
  },
  {
    title: "Données Météo",
    href: "/weather",
    description: "Consultez les données météo en temps réel.",
  },
  {
    title: "Test Oracle",
    href: "/oracle-test",
    description: "Testez et vérifiez le fonctionnement de l'oracle Nautilus TEE.",
  },
  {
    title: "Monitoring Oracle",
    href: "/oracle-monitoring",
    description: "Surveillez en temps réel les performances de l'oracle.",
  },
  {
    title: "À Propos",
    href: "/about",
    description: "Découvrez RainGuard et l'assurance agricole indexée.",
  },
];

export default function Navbar() {
  return (
    <NavigationMenu className="max-w-full justify-between p-4 bg-white border-b border-gray-200">
      <NavigationMenuList className="flex w-full justify-between items-center">
        <div className="flex items-center space-x-6">
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/" className="flex items-center space-x-2 font-semibold text-lg text-gray-900">
                🌾 RainGuard
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-gray-900">Features</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] bg-white">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <Link
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-slate-50 to-slate-100 p-6 no-underline outline-none focus:shadow-md"
                      href="/"
                    >
                      <div className="mb-2 mt-4 text-lg font-medium text-gray-900">
                        RainGuard
                      </div>
                      <p className="text-sm leading-tight text-slate-600">
                        Assurance agricole indexée sur blockchain pour protéger vos récoltes.
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                {components.map((component) => (
                  <ListItem
                    key={component.title}
                    title={component.title}
                    href={component.href}
                  >
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link href="/" className="text-gray-900">Accueil</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </div>

        <NavigationMenuItem className="flex ml-auto">
          <ConnectButton />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:text-slate-900 ${className}`}
          {...props}
        >
          <div className="text-sm font-medium leading-none text-gray-900">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-slate-600">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";