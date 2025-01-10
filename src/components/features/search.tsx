"use client";

import {
  ChangeEvent,
  ComponentProps,
  FormEvent,
  ReactNode,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { ArrowDownIcon, Loader, RotateCcwIcon, SearchIcon } from "lucide-react";
import { toast } from "sonner";
import { QueryResult } from "@/lib/types";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export function Search({ className }: { className?: string }) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [queryResults, setQueryResults] = useState<QueryResult[]>([]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value);
  };

  const handleReset = () => {
    setQueryResults([]);
  };

  const handleQuery = async () => {
    if (!query) return;

    setIsLoading(true);
    await fetch("/api/search", {
      method: "POST",
      body: JSON.stringify({ query }),
    })
      .then((res) => res.json())
      .then(({ articles }) => {
        setQueryResults((prevResults) => [
          ...prevResults,
          ...(articles as QueryResult[]),
        ]);
        setQuery("");
      })
      .catch(() => {
        toast.error("Failed to search. Please try again later.");
      })
      .finally(() => setIsLoading(false));
  };

  const handleSubmit = (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    handleQuery();
  };

  // definitely not the best way to do this but it works for now
  const handleRelatedSearch = async (relatedQuery: string) => {
    setQuery(relatedQuery);
    handleQuery();
  };

  return (
    <>
      <SearchContainer onSubmit={handleSubmit} className={cn(className)}>
        <SearchResetButton
          disabled={queryResults.length === 0}
          onReset={handleReset}
        />
        <SearchTextArea
          value={query}
          onChange={handleChange}
          disabled={isLoading}
        />
        <SearchButton disabled={isLoading}>
          {isLoading && <Loader className="animate-spin" />}
        </SearchButton>
      </SearchContainer>
      <SearchResultsContainer>
        {queryResults.map((result) => (
          <SearchResult
            key={result.id}
            result={result}
            onSubmit={handleRelatedSearch}
          />
        ))}
      </SearchResultsContainer>
    </>
  );
}

function SearchContainer({ className, ...props }: ComponentProps<"form">) {
  return (
    <form
      className={cn(
        "relative max-w-2xl w-full px-2 md:px-4 h-fit flex items-start justify-center gap-2",
        className
      )}
      {...props}
    />
  );
}

function SearchTextArea({
  className,
  ...props
}: ComponentProps<typeof Textarea>) {
  return (
    <Textarea
      name="search"
      placeholder="Tell me about central diabetes insipidus"
      className={cn(
        "mx-auto min-h-8 max-w-xl max-h-44 overflow-auto bg-input border rounded-lg px-3 py-2 text-sm focus-visible:ring-0 shadow-inner flex-grow",
        props.disabled && "opacity-60 cursor-not-allowed",
        className
      )}
      {...props}
    />
  );
}

function SearchButton({
  children,
  className,
  ...props
}: ComponentProps<typeof Button> & { children?: ReactNode }) {
  return (
    <Button
      type="submit"
      className={cn(
        "mt-2 text-white grid place-items-center p-2 bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 rounded-full drop-shadow-md aspect-square disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children || <PaperPlaneIcon />}
    </Button>
  );
}

function SearchResetButton({
  children,
  className,
  onReset,
  ...props
}: ComponentProps<typeof Button> & {
  onReset: () => void;
  children?: ReactNode;
}) {
  return (
    <Button
      type="submit"
      className={cn(
        "mt-2 dark:text-black grid place-items-center p-2  focus:outline-non rounded-full drop-shadow-md aspect-square disabled:opacity-50",
        className
      )}
      {...props}
      onClick={onReset}
    >
      {children || <RotateCcwIcon />}
    </Button>
  );
}

function SearchResultsContainer({ children }: { children: ReactNode }) {
  return (
    <div className="p-4 flex flex-wrap gap-2 justify-center h-full overflow-y-auto">
      {children}
    </div>
  );
}

function SearchResult({
  result,
  onSubmit,
}: {
  result: QueryResult;
  onSubmit: (relatedQuery: string) => void;
}) {
  const handleExploreRelated = () => {
    onSubmit(result.knowledge!.relationships[0].target);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="max-w-48 h-fit text-wrap grow">
          {result.knowledge!.article.Title}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-h-80 overflow-y-auto flex flex-col gap-1">
        <h3 className="text-lg font-semibold">{result.article?.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 w-full">
          {result.knowledge?.thoughts}
        </p>
        <div className="flex flex-col gap-2">
          {result.knowledge?.relationships.map((relationship) => (
            <div
              key={relationship.target}
              className="flex flex-col gap-1 border rounded p-2 text-center"
            >
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {relationship.source}
              </span>
              <ArrowDownIcon className="mx-auto" />
              <span className="text-sm text-gray-800 dark:text-gray-300">
                {relationship.target}
              </span>
              <Button
                type="button"
                variant="outline"
                className="mx-auto mt-2 item-end w-fit"
                onClick={handleExploreRelated}
              >
                Click to Explore <SearchIcon />
              </Button>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
