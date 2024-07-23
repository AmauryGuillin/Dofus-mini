import { cn } from "@/lib/utils";
import { NotebookPen } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { buttonVariants } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";

export default function Changelog() {
  return (
    <div className="absolute top-2 left-2">
      <Dialog>
        <DialogTrigger
          className={cn(
            buttonVariants({ variant: "outline", size: "icon" }),
            "bg-gray-900 text-white border-none"
          )}
        >
          <NotebookPen />
        </DialogTrigger>
        <DialogContent className="bg-gray-700 text-white">
          <DialogHeader className="text-xl font-bold">
            Notes de mises à jour
          </DialogHeader>
          <Accordion type="multiple">
            <AccordionItem value="item-1">
              <AccordionTrigger>Version 0.1.0 - 23/07/2024</AccordionTrigger>
              <AccordionContent>
                <ul>
                  <li className="text-lg font-bold">Fonctionnalités</li>
                  <li>- Mise en place du changelog.</li>
                  <li>
                    - Ajout de la visibilité de la portée des joueur et enemis
                    sur le terrain de jeu quand un joueur passe sa souris sur
                    son joueur ou les enemis.
                  </li>
                  <li>&nbsp;</li>
                  <li className="text-lg font-bold">Corrections</li>
                  <li>
                    - L'animations de l'attaque pression est maintenant ajustée
                    à la place du personnage initiale.
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </DialogContent>
      </Dialog>
    </div>
  );
}
