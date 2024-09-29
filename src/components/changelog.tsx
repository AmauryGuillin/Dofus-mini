import { cn } from "@/lib/utils";
import { ChangelogType } from "@/types/changelog-type";
import { NotebookPen } from "lucide-react";
import changelogs from "../changelogs/changelogs.json";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export default function Changelog() {
  const sortedChangelogs = changelogs.sort((a, b) => {
    const previousDate = new Date(a.date.split("/").reverse().join("-"));
    const afterDate = new Date(b.date.split("/").reverse().join("-"));

    return Number(afterDate) - Number(previousDate);
  });

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
        <DialogContent className="bg-gray-700 text-white h-[calc(100%-10%)]  w-1/2 max-w-screen overflow-auto flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl">Notes de mises à jour</DialogTitle>
            <DialogDescription>
              Visionner les dernières notes de mises à jour.
            </DialogDescription>
          </DialogHeader>
          <Accordion type="multiple">
            {sortedChangelogs?.map((changelog: ChangelogType) => (
              <AccordionItem value={changelog.version} key={changelog.version}>
                <AccordionTrigger>
                  Version: {changelog.version} - {changelog.date}
                </AccordionTrigger>
                <AccordionContent>
                  {changelog.features && (
                    <>
                      <h3 className="font-bold text-lg">
                        Nouvelles fonctionnalités
                      </h3>
                      <ul className="list-disc p-4 text-base">
                        {changelog.features.map((feature) => (
                          <li key={feature}>{feature}</li>
                        ))}
                      </ul>
                    </>
                  )}
                  {changelog.bugs && (
                    <>
                      <h3 className="font-bold text-lg">Corrections</h3>
                      <ul className="list-disc p-4 text-base">
                        {changelog.bugs.map((bug) => (
                          <li key={bug}>{bug}</li>
                        ))}
                      </ul>
                    </>
                  )}
                  {changelog.balancing && (
                    <>
                      <h3 className="font-bold text-lg">Equilibrage</h3>
                      <ul className="list-disc p-4 text-base">
                        {changelog.balancing.map((balance) => (
                          <li key={balance}>{balance}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </DialogContent>
      </Dialog>
    </div>
  );
}
