import { cn } from "@/lib/utils";
import { NotebookPen } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { buttonVariants } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

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
          <Accordion type="multiple">
            <AccordionItem value="item-1">
              <AccordionTrigger>Version 0.1.0 - 23/07/2024</AccordionTrigger>
              <AccordionContent>
                <ul>
                  <li className="text-xl">--Fonctionnalités--</li>
                  <li>Mise en place du changelog</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </DialogContent>
      </Dialog>
    </div>
  );
}
