import { IEventClient } from '@/types/Event';
import EventsFeed from '@/components/v2/EventsFeed';
import axios from 'axios';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const req = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${slug}`);
  if (!req.data.data.success) return {};
  const data: IEventClient = req.data.data.event;
  const url = `${process.env.NEXT_PUBLIC_API_URL}/events/${slug}`;
  const { description, title, images } = data
  return {
    title: `TheYard - ${data.title}`,
    description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      title: `TheYard - ${data.title}`,
      description,
      url,
      siteName: "TheYard",
      type: "article",
      locale: "en_US",
      images: images.length > 0 ? [{ url: images[0], width: 1200, height: 630, alt: `TheYard - ${title}` }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `TheYard - ${title}`,
      description,
      images: images.length > 0 ? images : [],
    },
    other: { "theme-color": "#ffffff" },
  };
}


export default async function page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <EventsFeed initialSlug={decodeURIComponent(slug)} />;
}
