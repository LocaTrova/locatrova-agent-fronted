import { FC, memo } from "react";
import {
  Landmark,
  BadgeCheck,
  Layers,
  Building2,
  MoveVertical,
  Ruler,
  LayoutGrid,
  BedDouble,
  Utensils,
  ShowerHead,
  Sofa,
  DoorOpen,
  Umbrella,
  Flame,
  Snowflake,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

type FeatureItem = {
  icon: FC<{ className?: string }>;
  title: string;
  description: string;
};

const FEATURES: FeatureItem[] = [
  { icon: Landmark, title: "Tipologia", description: "Appartamento | Intera proprietà | Classe immobile signorile" },
  { icon: BadgeCheck, title: "Contratto", description: "Vendita" },
  { icon: Stairs, title: "Piano", description: "4" },
  { icon: Building2, title: "Piani edificio", description: "5" },
  { icon: MoveVertical, title: "Ascensore", description: "Sì" },
  { icon: Ruler, title: "Superficie", description: "98 m²" },
  { icon: LayoutGrid, title: "Locali", description: "3" },
  { icon: BedDouble, title: "Camere da letto", description: "2" },
  { icon: Utensils, title: "Cucina", description: "Cucina angolo cottura" },
  { icon: ShowerHead, title: "Bagni", description: "2" },
  { icon: Sofa, title: "Arredato", description: "No" },
  { icon: DoorOpen, title: "Balcone", description: "No" },
  { icon: Umbrella, title: "Terrazzo", description: "No" },
  { icon: Flame, title: "Riscaldamento", description: "Centralizzato, a radiatori, alimentato a gas" },
  { icon: Snowflake, title: "Climatizzazione", description: "Predisposizione impianto" },
];

const OTHER_FEATURES = [
  "Esposizione doppia",
  "Infissi esterni in triplo vetro / PVC",
  "Porta blindata",
  "Impianto tv centralizzato",
];

const FeatureRow: FC<FeatureItem> = ({ icon: Icon, title, description }) => (
  <div className="grid grid-cols-[28px_1fr] gap-3">
    <Icon className="h-7 w-7 text-slate-700 mt-2" />
    <div>
      <dt className="text-slate-800 font-semibold leading-6">{title}</dt>
      <dd className="text-slate-600 text-sm leading-5">{description}</dd>
    </div>
  </div>
);

const FeaturesSection: FC = () => {
  return (
    <section aria-label="Caratteristiche" className="bg-[#FAF9F8] py-8">
      <div className="mx-auto w-full max-w-[2200px]">
        <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Caratteristiche</h2>
        <dl className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <FeatureRow key={f.title} {...f} />
          ))}
        </dl>

        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-slate-900 tracking-tight">Altre caratteristiche</h3>
          <ul className="mt-2 flex flex-wrap gap-2">
            {OTHER_FEATURES.map((label) => (
              <li key={label}>
                <Badge variant="secondary" className="h-6 text-[13px] font-medium rounded-md bg-slate-50 text-slate-700 border-slate-300">
                  {label}
                </Badge>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <button
            type="button"
            className="inline-flex items-center h-10 px-4 rounded-lg border border-slate-300 bg-white text-sky-700 text-sm font-medium uppercase tracking-wide hover:bg-slate-50 transition-colors"
          >
            Vedi tutte le caratteristiche
          </button>
        </div>
      </div>
    </section>
  );
};

export default memo(FeaturesSection);
