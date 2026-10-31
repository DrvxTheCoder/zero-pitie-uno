import { MainGrid, Stack } from "@/components/layout/AppShell";
import { Panel } from "@/components/ui/Panel";
import { cn } from "@/lib/utils";

/** Ink-outlined placeholder line; `w` is a width utility. */
function Bar({ w, className }: { w: string; className?: string }) {
  return <div className={cn("h-3.5 rounded-full border-2 border-ink bg-line", w, className)} />;
}

function Rows({ count }: { count: number }) {
  return Array.from({ length: count }, (_, i) => (
    <div key={i} className="flex items-center gap-3">
      <div className="size-8 shrink-0 rounded-full border-3 border-ink bg-line" />
      <Bar w={i % 2 ? "w-2/5" : "w-1/2"} />
      <Bar w="w-10" className="ml-auto" />
    </div>
  ));
}

/** Shown while a league page loads: paper panels in the board's layout, no spinner. */
export default function LeagueLoading() {
  return (
    <div aria-busy className="motion-safe:animate-pulse">
      <MainGrid>
        <Stack>
          <Panel stack>
            <Bar w="w-1/3" className="h-5" />
            <Bar w="w-full" />
          </Panel>
          <Panel stack="gap-3.5">
            <Bar w="w-1/4" className="h-5" />
            <Rows count={5} />
          </Panel>
        </Stack>
        <Stack>
          <Panel stack>
            <Bar w="w-1/2" className="h-5" />
            <Rows count={3} />
          </Panel>
        </Stack>
      </MainGrid>
    </div>
  );
}
