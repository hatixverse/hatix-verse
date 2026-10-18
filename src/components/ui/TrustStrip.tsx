import { trust } from "@/content/site";

export function TrustStrip() {
  return (
    <div className="border-line border-y">
      <ul className="wrap flex flex-wrap items-center justify-center gap-x-10 gap-y-3 py-5">
        {trust.map((t) => (
          <li key={t} className="label !text-muted flex items-center gap-3">
            <span aria-hidden className="bg-spark size-1.5 rounded-full" />
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}
