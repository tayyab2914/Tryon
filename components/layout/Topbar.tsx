import { Button } from "@/components/ui/Button";

interface TopbarProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function Topbar({ title, description, action }: TopbarProps) {
  return (
    <header className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-[22px] font-semibold tracking-tight text-ink">{title}</h1>
        {description && <p className="text-sm text-muted">{description}</p>}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm">Docs</Button>
        {action}
      </div>
    </header>
  );
}
