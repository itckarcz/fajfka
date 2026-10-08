import BottomNav from "@/components/BottomNav";
import cs from "@/texts/cs";

export default function VicePage() {
  return (
    <div className="flex flex-col h-dvh max-w-[390px] mx-auto bg-paper text-ink font-sans">
      <header className="flex items-center px-4 pt-5 pb-2">
        <h1 className="m-0 font-display text-title">{cs.more.title}</h1>
      </header>
      <main className="flex-1 overflow-y-auto px-4 flex flex-col gap-2 pt-4">
        <p className="text-ink-muted text-body">Tu bude ceník, nastavenia, export a predplatné.</p>
      </main>
      <BottomNav active="/vice" />
    </div>
  );
}
