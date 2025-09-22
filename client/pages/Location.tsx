import { useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import FeaturesSection from "@/components/location/Features";
import MapSection from "@/components/location/MapSection";
import FloorplanSection from "@/components/location/Floorplan";
import { MapPin, ArrowLeft, Heart } from "lucide-react";

export default function LocationPage() {
  const { id, identifier } = useParams<{ id: string; identifier?: string }>();
  const navigate = useNavigate();

  // Demo image set (replace with real data in a later step)
  const images = useMemo(
    () => [
      // Main
      "https://ssl.cdn-redfin.com/system_files/media/1148538_JPG/item_2.jpg",
      // Others
      "https://ssl.cdn-redfin.com/system_files/media/1148538_JPG/genLdpUgcMediaBrowserUrlComp/item_7.jpg",
      "https://ssl.cdn-redfin.com/system_files/media/1148538_JPG/genLdpUgcMediaBrowserUrlComp/item_8.jpg",
      "https://ssl.cdn-redfin.com/system_files/media/1148538_JPG/genLdpUgcMediaBrowserUrlComp/item_12.jpg",
      "https://ssl.cdn-redfin.com/system_files/media/1148538_JPG/genLdpUgcMediaBrowserUrlComp/item_15.jpg",
      "https://ssl.cdn-redfin.com/system_files/media/1148538_JPG/genLdpUgcMediaBrowserUrlComp/item_17.jpg",
      "https://ssl.cdn-redfin.com/system_files/media/1148538_JPG/genLdpUgcMediaBrowserUrlComp/item_22.jpg",
    ],
    [],
  );

  return (
    <main
      aria-label="Location gallery"
      className="min-h-screen w-full bg-[#FAF9F8]"
    >
      <div className="mx-auto w-full max-w-[2200px] px-4 sm:px-6 lg:px-8 py-4">
        <nav className="sticky top-2 z-20">
          <button
            type="button"
            onClick={() => navigate("/chat")}
            className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur border border-slate-200 px-3 py-1.5 text-sm text-slate-700 shadow-sm hover:shadow-md hover:bg-white transition"
            aria-label="Torna indietro"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Indietro</span>
          </button>
        </nav>
        {/* Responsive photo grid */}
        <div
          className="grid gap-2 sm:gap-3 md:gap-4 mt-4 [grid-template-columns:1fr] md:[grid-template-columns:2fr_1fr_1fr]"
        >
          {/* Column 1: big hero image */}
          <div className="grid gap-2 sm:gap-3 md:gap-4">
            <div className="group relative h-[320px] sm:h-[420px] md:h-[520px] lg:h-[600px] overflow-hidden rounded-md">
              <img
                src={images[0]}
                alt={`Location ${id}${identifier ? ` – ${identifier}` : ""} main`}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.01]"
                loading="eager"
              />
            </div>
          </div>

          {/* Column 2 */}
          <div className="grid gap-2 sm:gap-3 md:gap-4 content-start">
            {images.slice(1, 3).map((src, i) => (
              <div
                key={src}
                className="group relative h-[150px] sm:h-[200px] md:h-[230px] overflow-hidden rounded-md"
              >
                <img
                  src={src}
                  alt={`Location ${id} photo ${i + 2}`}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          {/* Column 3 */}
          <div className="grid gap-2 sm:gap-3 md:gap-4 content-start">
            {images.slice(3, 5).map((src, i) => (
              <div
                key={src}
                className="group relative h-[150px] sm:h-[200px] md:h-[230px] overflow-hidden rounded-md"
              >
                <img
                  src={src}
                  alt={`Location ${id} photo ${i + 4}`}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom row thumbnails */}
        <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
          {images.slice(5).map((src, i) => (
            <div
              key={src}
              className="group relative aspect-[4/3] overflow-hidden rounded-md"
            >
              <img
                src={src}
                alt={`Location ${id} extra photo ${i + 6}`}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Info header */}
        <div className="mt-6 grid grid-cols-[auto_1fr] items-center gap-3 overflow-hidden">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="h-12 w-12 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm shrink-0"
              aria-label="Apri mappa"
              aria-controls="map-section"
              title="Vai alla mappa"
              onClick={() => document.getElementById('map-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <MapPin className="h-5 w-5 text-slate-700" />
            </button>
            <button
              type="button"
              className="h-12 w-12 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm shrink-0"
              aria-label="Aggiungi ai preferiti"
              title="Aggiungi ai preferiti"
            >
              <Heart className="h-5 w-5 text-rose-600" />
            </button>
          </div>
          <div className="min-w-0">
            <h1 className="text-[20px] font-semibold pr-4 truncate">
              Trilocale via Rodolfo Lanciani 7, Bologna, Roma
            </h1>
            <nav
              className="pt-0.5 text-slate-600 text-sm"
              aria-label="Percorso"
            >
              <ol className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <li>Roma</li>
                <li className="relative before:content-['•'] before:mr-4 before:text-slate-400">
                  Bologna
                </li>
                <li className="relative before:content-['•'] before:mr-4 before:text-slate-400">
                  Via Rodolfo Lanciani
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Descrizione section */}
        <section
          aria-label="Descrizione"
          id="descrizione"
          className="mt-6 border-t border-slate-200 pt-6"
        >
          <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Descrizione
          </h2>
          <p className="mt-2 font-semibold text-slate-800">
            <span className="capitalize">riferimento</span>:{" "}
            <span>Lanciani grande</span>
          </p>
          <p className="mt-1 font-semibold uppercase text-slate-900">
            trilocale nuova realizzazione
          </p>
          <div className="mt-2 text-slate-700">
            <p>
              Via Lanciani in prossimità di Piazza Orazio Marucchi, a breve
              distanza da Villa Torlonia, in palazzo degli anni ’40, elegante
              appartamento di nuova realizzazione posto al piano quarto con
              doppia esposizione e zona giorno esposta a Sud, che garantisce
              grande luminosità agli spazi. Internamente l’immobile è composto
              da ingresso, ampio salone con angolo cottura, due camere più una
              zona studio, doppi servizi e una stanza lavanderia dotata di
              finestra. La consegna è prevista entro dicembre 2025, le finiture
              interne utilizzate sono di pregio, gli impianti avranno tutte le
              certificazioni di conformità. Essendo l’immobile in fase di
              completamento, è ancora possibile apportare modifiche agli spazi e
              personalizzare le finiture. Al momento sono previsti pavimenti in
              gres porcellanato effetto legno e i rivestimenti del bagno in gres
              porcellanato (60x120) effetto marmo. I materiali utilizzati, ivi
              compresi gli infissi in PVC triplo vetro della Schuco,
              garantiranno il massimo comfort acustico, il pieno rispetto degli
              standard ambientali più stringenti ed un’alta efficienza
              energetica (Classe A). Saranno inoltre disponibili serrande
              elettriche, scalda Acqua in Pompa di Calore e impianto di
              condizionamento. Per qualsiasi altra personalizzazione la società
              costruttrice è disponibile ad incontrare le esigenze
              dell’acquirente, compatibilmente con lo stato di avanzamento dei
              lavori.
            </p>
          </div>
        </section>

        {/* Features section */}
        <section aria-label="Caratteristiche" id="caratteristiche" className="mt-8 border-t border-slate-200 pt-6">
          <FeaturesSection />
        </section>

        {/* Planimetria section */}
        <section id="planimetria" className="mt-2 border-t border-slate-200 pt-6">
          <FloorplanSection />
        </section>

        {/* Map section */}
        <section id="map-section" className="mt-2 border-t border-slate-200 pt-6">
          <MapSection address="Via Rodolfo Lanciani 7, Roma" markers={[]} />
        </section>
      </div>
    </main>
  );
}
