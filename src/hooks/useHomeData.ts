import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import type { IPackage } from "@/types/Package";
import type { IEvent } from "@/types/Event";
import type { IReviewClient } from "@/types/Review";
import type { IGalleryClient } from "@/types/Gallery";

interface HomeData {
  packages: IPackage[];
  events: IEvent[];
  testimonials: IReviewClient[];
  gallery: IGalleryClient[];
}

const EMPTY_HOME_DATA: HomeData = {
  packages: [],
  events: [],
  testimonials: [],
  gallery: [],
};

export function useHomeData() {
  const [data, setData] = useState<HomeData>(EMPTY_HOME_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [retryToken, setRetryToken] = useState(0);

  const retry = useCallback(() => setRetryToken((token) => token + 1), []);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        document.body.style.overflow = "hidden"; // Disable scrolling while loading

        const [packagesRes, eventsRes, testimonialsRes, galleryRes] = await Promise.all([
          axios.get("/api/packages", { signal: controller.signal }),
          axios.get("/api/events", { signal: controller.signal }),
          axios.get("/api/reviews", { signal: controller.signal }),
          axios.get("/api/gallery", { signal: controller.signal }),
        ]);

        setData({
          packages: packagesRes.data.data.packages,
          events: eventsRes.data.data.events,
          testimonials: testimonialsRes.data.data.reviews,
          gallery: galleryRes.data.data.gallery,
        });
      } catch (err) {
        if (axios.isCancel(err)) return;
        console.error("Failed to load home page data ❌", err);
        setError(err);
      } finally {
        if (!controller.signal.aborted) {
          document.body.style.overflow = "auto"; // Re-enable scrolling
          setIsLoading(false);
        }
      }
    })();

    return () => controller.abort();
  }, [retryToken]);

  return { ...data, isLoading, error, retry };
}
