import { memo, useMemo } from "react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import {
  Accessibility,
  BadgeCheck,
  Bath,
  Building2,
  Car,
  Clapperboard,
  Clock,
  ClipboardCheck,
  DoorOpen,
  FileText,
  MapPin,
  Martini,
  Maximize2,
  Music,
  Palette,
  Plug,
  Road,
  Ruler,
  Shield,
  Sparkles,
  Star,
  Sunrise,
  Sun,
  Tags,
  Truck,
  Trees,
  Users,
  Waveform,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { TYPE } from "@/constants/styles";

type FeatureStatus = "ideal" | "warning" | "critical" | "neutral";

type StatusTone = "positive" | "negative" | "neutral" | "warning";

type FeatureItem = {
  icon: LucideIcon;
  label: string;
  value: string | number | ReactNode;
  helperText?: string;
  tooltip?: string;
  status?: FeatureStatus;
};

type LocationSpace = {
  name: string;
  description: string;
  icon: LucideIcon;
};

type CinemaLocationType = "studio" | "historic" | "club" | "outdoor";

type CinemaLocationProfile = {
  locationType: CinemaLocationType;
  sentiment: {
    mood: string;
    filmSuitability: { score: number; description: string };
    popularTimes: string[];
  };
  bimData: {
    usableAreaSqm: number;
    totalAreaSqm?: number;
    technicalNotes: string;
  };
  dimensions: {
    heightM: number;
    widthM: number;
  };
  logistics: {
    power: {
      outlets: string;
      powerNotes: string;
    };
    heavyVehicleAccess: {
      vehicleType: string;
      accessPoint: string;
    };
  };
  details: {
    capacity: number;
    soundProfile: string;
    wheelchairAccessible: boolean;
    parking: boolean;
    restrooms: boolean;
    hours: string;
    priceRange: string;
    surroundings: string;
    tags: string[];
  };
  spaces: LocationSpace[];
  productionNotes: string;
  studioDetails?: {
    soundStages: string;
    totalAreaSqm: number;
    riggingPoints: string;
    isolation: string;
  };
  historicDetails?: {
    heritageConstraints: string;
    protectionNotes: string;
    era: string;
    historicOutdoors: string;
  };
  clubDetails?: {
    audioSystem: string;
    stageInfo: string;
    loungeAreas: string;
    suitedFor: string;
  };
  outdoorDetails?: {
    naturalLight: string;
    cover: string;
    roadAccess: string;
    permits: string;
  };
};

const formatNumber = (value: number) =>
  new Intl.NumberFormat("it-IT", { maximumFractionDigits: 0 }).format(value);

const ratingToPercentage = (score: number) =>
  Math.min(100, Math.max(0, (score / 10) * 100));

const STATUS_ICON_TONES: Record<FeatureStatus, string> = {
  ideal: "bg-emerald-100 text-emerald-700 border-emerald-200",
  warning: "bg-amber-100 text-amber-700 border-amber-200",
  critical: "bg-rose-100 text-rose-700 border-rose-200",
  neutral: "bg-slate-100 text-slate-700 border-slate-200",
};

const STATUS_VALUE_TONES: Record<FeatureStatus, string> = {
  ideal: "text-emerald-700",
  warning: "text-amber-700",
  critical: "text-rose-700",
  neutral: "text-slate-900",
};

const SECTION_HEADING = "text-lg font-semibold text-slate-900";

const BADGE_TONES: Record<StatusTone, string> = {
  positive:
    "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
  negative: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200",
  neutral: "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200",
  warning: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
};

type StatusBadgeProps = {
  tone: StatusTone;
  label: string;
};

const StatusBadge = ({ tone, label }: StatusBadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
      BADGE_TONES[tone],
    )}
  >
    <span
      className={cn(
        "h-2 w-2 rounded-full",
        tone === "positive" && "bg-emerald-500",
        tone === "negative" && "bg-rose-500",
        tone === "neutral" && "bg-slate-500",
        tone === "warning" && "bg-amber-500",
      )}
    />
    {label}
  </span>
);

type FeatureListProps = {
  title?: string;
  items: FeatureItem[];
};

const FeatureList = ({ title, items }: FeatureListProps) => (
  <div className="space-y-3">
    {title && <h3 className="text-sm font-semibold text-slate-600">{title}</h3>}
    <div className="grid gap-3">
      {items.map((item) => (
        <FeatureRow key={item.label} {...item} />
      ))}
    </div>
  </div>
);

type FeatureRowProps = FeatureItem;

const FeatureRow = ({
  icon: Icon,
  label,
  value,
  helperText,
  tooltip,
  status,
}: FeatureRowProps) => {
  const safeStatus = status ?? "neutral";
  const iconClasses = STATUS_ICON_TONES[safeStatus];
  const valueClasses = STATUS_VALUE_TONES[safeStatus];
  const valueContent =
    typeof value === "string" || typeof value === "number" ? (
      <span className="text-sm font-semibold">{value}</span>
    ) : (
      value
    );

  const contentWrapper = (
    <div
      className={cn(
        "flex flex-col items-end gap-1 text-sm font-semibold text-right",
        valueClasses,
      )}
    >
      {valueContent}
    </div>
  );

  return (
    <div className="grid grid-cols-[44px_1fr_auto] items-start gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-full border",
          iconClasses,
        )}
      >
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <div className="space-y-1">
        <dt className="text-sm font-semibold text-slate-900">{label}</dt>
        {helperText && <dd className="text-xs text-slate-500">{helperText}</dd>}
      </div>
      {tooltip ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{contentWrapper}</TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs text-left">
              {tooltip}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        contentWrapper
      )}
    </div>
  );
};

const RatingDisplay = ({ score }: { score: number }) => (
  <div className="flex flex-col items-end gap-1">
    <span className="text-sm font-semibold text-slate-900">{score.toFixed(1)}/10</span>
    <span className="sr-only">Valutazione cinematografica</span>
    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-200">
      <span
        className="block h-full rounded-full bg-amber-500"
        style={{ width: `${ratingToPercentage(score)}%` }}
        aria-hidden
      />
    </div>
  </div>
);

type RoomGridProps = {
  spaces: LocationSpace[];
};

const RoomsGrid = ({ spaces }: RoomGridProps) => (
  <div className="mt-6 space-y-3">
    <h3 className={SECTION_HEADING}>Spazi Disponibili</h3>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {spaces.map((space) => (
        <article
          key={space.name}
          className="flex h-full flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700">
              <space.icon className="h-5 w-5" aria-hidden />
            </div>
            <h4 className="text-sm font-semibold text-slate-900">{space.name}</h4>
          </div>
          <p className="text-sm leading-5 text-slate-600">{space.description}</p>
        </article>
      ))}
    </div>
  </div>
);

type NotesProps = {
  productionNotes: string;
  technicalNotes: string;
};

const NotesSection = ({ productionNotes, technicalNotes }: NotesProps) => (
  <div className="mt-6 grid gap-4 md:grid-cols-2">
    <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <h3 className={SECTION_HEADING}>Note Produzione</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{productionNotes}</p>
    </div>
    <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-800">Note Tecniche</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{technicalNotes}</p>
    </div>
  </div>
);

const AdditionalSections = ({
  profile,
}: {
  profile: CinemaLocationProfile;
}) => {
  if (profile.locationType === "studio" && profile.studioDetails) {
    const items: FeatureItem[] = [
      {
        icon: Building2,
        label: "Teatri di Posa",
        value: profile.studioDetails.soundStages,
      },
      {
        icon: Ruler,
        label: "Superficie Totale",
        value: `${formatNumber(profile.studioDetails.totalAreaSqm)} m²`,
      },
      {
        icon: ClipboardCheck,
        label: "Rigging Points",
        value: profile.studioDetails.riggingPoints,
      },
      {
        icon: Shield,
        label: "Isolamento",
        value: profile.studioDetails.isolation,
        status: "ideal",
      },
    ];

    return (
      <div className="mt-8 space-y-3">
        <h3 className={`${SECTION_HEADING} flex items-center gap-2`}>
          <BadgeCheck className="h-5 w-5 text-slate-600" aria-hidden />
          Specifiche Studio
        </h3>
        <FeatureList items={items} />
      </div>
    );
  }

  if (profile.locationType === "historic" && profile.historicDetails) {
    const items: FeatureItem[] = [
      {
        icon: ScrollText,
        label: "Vincoli Monumentali",
        value: profile.historicDetails.heritageConstraints,
        status: "warning",
      },
      {
        icon: Shield,
        label: "Protezioni Richieste",
        value: profile.historicDetails.protectionNotes,
      },
      {
        icon: Palette,
        label: "Epoca",
        value: profile.historicDetails.era,
      },
      {
        icon: Trees,
        label: "Esterni Storici",
        value: profile.historicDetails.historicOutdoors,
      },
    ];

    return (
      <div className="mt-8">
        <h3 className={`${SECTION_HEADING} mb-3 flex items-center gap-2`}>
          <Building2 className="h-5 w-5 text-slate-600" aria-hidden />
          Patrimonio & Vincoli
        </h3>
        <FeatureList items={items} />
      </div>
    );
  }

  if (profile.locationType === "club" && profile.clubDetails) {
    const items: FeatureItem[] = [
      {
        icon: Music,
        label: "Sistema Audio",
        value: profile.clubDetails.audioSystem,
      },
      {
        icon: DoorOpen,
        label: "Pista/Palco",
        value: profile.clubDetails.stageInfo,
      },
      {
        icon: Martini,
        label: "Aree Bar/Lounge",
        value: profile.clubDetails.loungeAreas,
      },
      {
        icon: Clapperboard,
        label: "Adatto per",
        value: profile.clubDetails.suitedFor,
      },
    ];

    return (
      <div className="mt-8">
        <h3 className={`${SECTION_HEADING} mb-3 flex items-center gap-2`}>
          <Music className="h-5 w-5 text-slate-600" aria-hidden />
          Eventi & Intrattenimento
        </h3>
        <FeatureList items={items} />
      </div>
    );
  }

  if (profile.locationType === "outdoor" && profile.outdoorDetails) {
    const items: FeatureItem[] = [
      {
        icon: Sun,
        label: "Luce Naturale",
        value: profile.outdoorDetails.naturalLight,
        status: "warning",
      },
      {
        icon: Umbrella,
        label: "Coperture",
        value: profile.outdoorDetails.cover,
      },
      {
        icon: Road,
        label: "Accessibilità",
        value: profile.outdoorDetails.roadAccess,
      },
      {
        icon: ClipboardCheck,
        label: "Permessi Richiesti",
        value: profile.outdoorDetails.permits,
      },
    ];

    return (
      <div className="mt-8">
        <h3 className={`${SECTION_HEADING} mb-3 flex items-center gap-2`}>
          <Sun className="h-5 w-5 text-slate-600" aria-hidden />
          Considerazioni Ambientali
        </h3>
        <FeatureList items={items} />
      </div>
    );
  }

  return null;
};

const demoProfile: CinemaLocationProfile = {
  locationType: "studio",
  sentiment: {
    mood: "Industriale, versatile, scenografico",
    filmSuitability: {
      score: 9,
      description:
        "Ideale per spot moda, serie crime e video musicali con controluce urban.",
    },
    popularTimes: ["Alba", "Golden hour", "Notte"],
  },
  bimData: {
    usableAreaSqm: 1200,
    totalAreaSqm: 3200,
    technicalNotes:
      "Struttura in acciaio con portata 800 kg/punto, quadri certificati CEI 64-8. Passerelle aeree integrate, fibra 10 Gb ready, carriponte 1.5 t con certificazioni aggiornate.",
  },
  dimensions: {
    heightM: 6.5,
    widthM: 28,
  },
  logistics: {
    power: {
      outlets: "Trifase 380V e monofase 220V su linee dedicate",
      powerNotes:
        "Carico massimo 180 kW con ridondanza UPS; generatori mobili predisposti.",
    },
    heavyVehicleAccess: {
      vehicleType: "Camion cinematografici e furgoni 7,5 t",
      accessPoint: "Ingresso carrabile interno da Via Ostiense",
    },
  },
  details: {
    capacity: 320,
    soundProfile: "Trattamento acustico variabile con pannelli mobili",
    wheelchairAccessible: true,
    parking: true,
    restrooms: true,
    hours: "07:00 – 02:00 (estendibile su richiesta)",
    priceRange: "€€€",
    surroundings: "Quartiere creativo Ostiense, servizi e hospitality a 5 minuti",
    tags: ["studio", "industrial", "rigging-ready", "soundproof"],
  },
  spaces: [
    {
      name: "Stage A",
      description: "Teatro principale 45×28 m con ciclorama bianco e graticce.",
      icon: DoorOpen,
    },
    {
      name: "Sala Regia",
      description: "Cabina insonorizzata con routing video SDI e intercom full-duplex.",
      icon: Building2,
    },
    {
      name: "Backstage",
      description: "Area trucco & costumi con 6 postazioni, luci bilanciate 5600K.",
      icon: Sparkles,
    },
  ],
  productionNotes:
    "Layout modulare, black-out totale disponibile. Supporto on-site per scenografie e rigging.",
  studioDetails: {
    soundStages: "3 teatri di posa insonorizzati (Stage A/B/C)",
    totalAreaSqm: 3200,
    riggingPoints: "Graticce perimetrali con portata 800 kg/punto",
    isolation: "Insonorizzazione professionale per ripresa audio diretta",
  },
};

const FeaturesSection = () => {
  const profile = demoProfile;
  const essentials = useMemo<FeatureItem[]>(
    () => [
      {
        icon: Sparkles,
        label: "Mood/Atmosfera",
        value: profile.sentiment.mood,
      },
      {
        icon: Star,
        label: "Rating Cinematografico",
        value: <RatingDisplay score={profile.sentiment.filmSuitability.score} />,
        helperText: profile.sentiment.filmSuitability.description,
        status: "ideal",
      },
      {
        icon: Ruler,
        label: "Superficie Utile",
        value: `${formatNumber(profile.bimData.usableAreaSqm)} m²`,
        status: "ideal",
      },
      {
        icon: Maximize2,
        label: "Dimensioni",
        value: `${profile.dimensions.heightM.toFixed(1)} m H × ${profile.dimensions.widthM.toFixed(1)} m L`,
      },
      {
        icon: Users,
        label: "Capacità",
        value: `${formatNumber(profile.details.capacity)} persone`,
        status: profile.details.capacity >= 300 ? "ideal" : "warning",
      },
    ],
    [profile],
  );

  const technical = useMemo<FeatureItem[]>(
    () => [
      {
        icon: Plug,
        label: "Alimentazione",
        value: profile.logistics.power.outlets,
        status: "ideal",
      },
      {
        icon: FileText,
        label: "Note Potenza",
        value: profile.logistics.power.powerNotes,
      },
      {
        icon: Truck,
        label: "Accesso Mezzi",
        value: profile.logistics.heavyVehicleAccess.vehicleType,
      },
      {
        icon: MapPin,
        label: "Punto Accesso",
        value: profile.logistics.heavyVehicleAccess.accessPoint,
      },
      {
        icon: Waveform,
        label: "Profilo Audio",
        value: profile.details.soundProfile,
        status: "ideal",
      },
    ],
    [profile],
  );

  const services = useMemo<FeatureItem[]>(
    () => [
      {
        icon: Accessibility,
        label: "Accessibilità",
        value: (
          <StatusBadge
            tone={profile.details.wheelchairAccessible ? "positive" : "negative"}
            label={profile.details.wheelchairAccessible ? "Garantita" : "Limitata"}
          />
        ),
      },
      {
        icon: Car,
        label: "Parcheggio",
        value: (
          <StatusBadge
            tone={profile.details.parking ? "positive" : "negative"}
            label={profile.details.parking ? "Disponibile" : "Assente"}
          />
        ),
      },
      {
        icon: Bath,
        label: "Servizi Igienici",
        value: (
          <StatusBadge
            tone={profile.details.restrooms ? "positive" : "negative"}
            label={profile.details.restrooms ? "Presenti" : "Assenti"}
          />
        ),
      },
      {
        icon: Clock,
        label: "Orari Disponibili",
        value: profile.details.hours,
      },
      {
        icon: Wallet,
        label: "Range Prezzo",
        value: (
          <StatusBadge
            tone={profile.details.priceRange.length <= 2 ? "positive" : "warning"}
            label={profile.details.priceRange}
          />
        ),
      },
    ],
    [profile.details],
  );

  const creative = useMemo<FeatureItem[]>(
    () => [
      {
        icon: Sunrise,
        label: "Orari Migliori",
        value: profile.sentiment.popularTimes.join(", "),
      },
      {
        icon: Clapperboard,
        label: "Idoneità Film",
        value: profile.sentiment.filmSuitability.description,
      },
      {
        icon: Tags,
        label: "Tags",
        value: (
          <div className="flex flex-wrap justify-end gap-2">
            {profile.details.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700"
              >
                {tag}
              </Badge>
            ))}
          </div>
        ),
      },
      {
        icon: Trees,
        label: "Contesto",
        value: profile.details.surroundings,
      },
    ],
    [profile.details, profile.sentiment],
  );

  return (
    <section aria-label="Caratteristiche location" className="bg-[#FAF9F8]">
      <div className="mx-auto w-full max-w-[2200px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 className={`${TYPE.H2} flex items-center gap-2 text-slate-900`}>
            🎬 Caratteristiche della Location
          </h2>
          <p className="text-sm text-slate-600">
            Panoramica adattiva delle feature di produzione, tecnica e creativa.
          </p>
        </div>

        <Tabs defaultValue="essentials" className="mt-6">
          <TabsList className="flex flex-wrap gap-2 bg-transparent p-0">
            <TabsTrigger
              value="essentials"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              🎯 Essenziali
            </TabsTrigger>
            <TabsTrigger
              value="technical"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              ⚡ Tecnica
            </TabsTrigger>
            <TabsTrigger
              value="services"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              🏢 Servizi & Logistica
            </TabsTrigger>
            <TabsTrigger
              value="creative"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              🎨 Creatività & Atmosfera
            </TabsTrigger>
          </TabsList>

          <TabsContent value="essentials" className="mt-4">
            <FeatureList items={essentials} />
          </TabsContent>
          <TabsContent value="technical" className="mt-4">
            <FeatureList items={technical} />
          </TabsContent>
          <TabsContent value="services" className="mt-4">
            <FeatureList items={services} />
          </TabsContent>
          <TabsContent value="creative" className="mt-4">
            <FeatureList items={creative} />
          </TabsContent>
        </Tabs>

        <RoomsGrid spaces={profile.spaces} />
        <NotesSection
          productionNotes={profile.productionNotes}
          technicalNotes={profile.bimData.technicalNotes}
        />
        <AdditionalSections profile={profile} />
      </div>
    </section>
  );
};

export default memo(FeaturesSection);
