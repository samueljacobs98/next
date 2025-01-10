import { Search } from "@/components/features/search";
import { TypingAnimation } from "@/components/ui/typing-animation";

export default function Home() {
  return (
    <div className="w-full space-y-2">
      <TypingAnimation
        className="text-center text-4xl font-bold leading-[5rem] tracking-[-0.02em] drop-shadow-sm"
        text="What topic would you like to research?"
        as="h2"
        duration={75}
      />
      <Search className="mx-auto" />
    </div>
  );
}
