import { useMemo } from "react";
import { useParams } from "react-router";

export default function LocationPage() {
  const { id, identifier } = useParams<{ id: string; identifier?: string }>();

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
        {/* Responsive photo grid */}
        <div
          className="grid gap-2 sm:gap-3 md:gap-4"
          style={{ gridTemplateColumns: "2fr 1fr 1fr" }}
        >
          {/* Column 1: big hero image */}
          <div className="grid gap-2 sm:gap-3 md:gap-4">
            <div className="relative h-[320px] sm:h-[420px] md:h-[520px] lg:h-[600px] overflow-hidden rounded-md">
              <img
                src={images[0]}
                alt={`Location ${id}${identifier ? ` – ${identifier}` : ""} main`}
                className="absolute inset-0 h-full w-full object-cover"
                loading="eager"
              />
            </div>
          </div>

          {/* Column 2 */}
          <div className="grid gap-2 sm:gap-3 md:gap-4 content-start">
            {images.slice(1, 3).map((src, i) => (
              <div key={src} className="relative h-[150px] sm:h-[200px] md:h-[230px] overflow-hidden rounded-md">
                <img
                  src={src}
                  alt={`Location ${id} photo ${i + 2}`}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          {/* Column 3 */}
          <div className="grid gap-2 sm:gap-3 md:gap-4 content-start">
            {images.slice(3, 5).map((src, i) => (
              <div key={src} className="relative h-[150px] sm:h-[200px] md:h-[230px] overflow-hidden rounded-md">
                <img
                  src={src}
                  alt={`Location ${id} photo ${i + 4}`}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom row thumbnails */}
        <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
          {images.slice(5).map((src, i) => (
            <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-md">
              <img
                src={src}
                alt={`Location ${id} extra photo ${i + 6}`}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
