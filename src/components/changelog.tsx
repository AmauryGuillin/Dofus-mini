import { cn } from "@/lib/utils";
import matter from "gray-matter";
import { NotebookPen } from "lucide-react";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
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

type Changelog = {
  version: string;
  date: string;
  content: string;
};

export default function Changelog() {
  const [changelogs, setChangelogs] = useState<Changelog[]>();

  useEffect(() => {
    // Récupère tous les fichiers .md contenu dans le dossiers changelogs
    const changelogsFiles = import.meta.glob("/dist/changelogs/*.md", {
      query: "?raw",
      import: "default",
    }) as Record<string, () => Promise<string>>;

    // Récupère les clés et les trie par ordre décroissant
    const sortedKeys = Object.keys(changelogsFiles).sort((a, b) =>
      b.localeCompare(a)
    );

    // Crée un nouvel objet avec les clés triées
    const sortedChangelogsFiles: { [key: string]: () => Promise<string> } =
      sortedKeys.reduce((acc, key) => {
        acc[key] = changelogsFiles[key];
        return acc;
      }, {} as { [key: string]: () => Promise<string> });

    // Récupère les données de chaque fichier .md
    const fetchChangelogs = async () => {
      const contents = await Promise.all(
        sortedKeys.map((key) => sortedChangelogsFiles[key]())
      );
      const changelogs = [];
      for (const fileContent of contents) {
        const { content, data } = matter(fileContent);
        const newChangelog = {
          version: data.version,
          date: data.date,
          content,
        };
        changelogs.push(newChangelog);
      }
      setChangelogs(changelogs);
    };

    fetchChangelogs();
  }, []);

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
            {changelogs?.map((changelog) => (
              <AccordionItem value={changelog.version} key={changelog.version}>
                <AccordionTrigger>
                  Version: {changelog.version} - {changelog.date}
                </AccordionTrigger>
                <AccordionContent>
                  <Markdown className="prose text-white prose-h3:text-white">
                    {changelog.content}
                  </Markdown>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </DialogContent>
      </Dialog>
    </div>
  );
}
