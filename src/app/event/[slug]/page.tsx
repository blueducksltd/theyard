import EventPageClient from "@/components/EventPageClient";
import { IEvent } from "@/types/Event";
import { getSingleEvent } from "@/util";
import { Metadata } from "next";
import React from "react";

interface IProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
  const { slug } = await params;
  const title = decodeURIComponent(slug).replaceAll("-", " ");

  try {
    const response = await getSingleEvent(title);

    if (response.success && response.data.event) {
      const event = response.data.event;
      const url = `${process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com"}/event/${title}`;

      return {
        title: event.title,
        description: event.description,
        openGraph: {
          title: event.title,
          description: event.description,
          url: url,
          siteName: "The Yard",
          images: [
            {
              url: event.images[0],
              width: 1200,
              height: 630,
              alt: event.title,
            },
          ],
          locale: "en_US",
          type: "website",
        },
        twitter: {
          card: "summary_large_image",
          title: event.title,
          description: event.description,
          images: [event.images[0]],
        },
      };
    }
  } catch (error) {
    console.error("Error generating metadata:", error);
  }

  return {
    title: "Event Not Found",
    description: "The requested event could not be found.",
  };
}

const Page = async ({ params }: IProps) => {
  const { slug } = await params;
  const event: IEvent = (await getSingleEvent(slug)).data.event;

  return <EventPageClient event={event} />;
};

export default Page;
