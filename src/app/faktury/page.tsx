import BottomNav from "@/components/BottomNav";
import cs from "@/texts/cs";

export default function FakturyPage() {
  return (
    <div className="flex flex-col h-dvh max-w-[390px] mx-auto bg-paper text-ink font-sans">
      <header className="flex items-center px-4 pt-5 pb-2">
        <h1 className="m-0 font-display text-title">{cs.invoiceList.title}</h1>
      </header>
      <main className="flex-1 overflow-y-auto px-4 flex items-center justify-center">
        <p className="text-ink-muted">{cs.invoiceList.empty}</p>
      </main>
      <BottomNav active="/faktury" />
    </div>
  );
}
