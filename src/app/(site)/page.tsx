"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Pagination, Autoplay, EffectFade, FreeMode } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/free-mode';

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { IPackage } from "@/types/Package";
import { IEvent } from "@/types/Event";
import { IReviewClient } from "@/types/Review";
import { IGalleryClient } from "@/types/Gallery";
import { BentoGrid } from "./gallery/page";
import Loading from "@/components/v2/Loading";
import ReviewModal from "@/components/v2/home/ReviewModal";
const services: { title: string; subtitle: string; image: string }[] = [
  {
    title: "Couple's Escape",
    subtitle:
      "A private outdoor experience crafted for romance, relaxation, and meaningful moments.",
    image: "/images/drive-15.jpg",
  },
  {
    title: "Family Picnic",
    subtitle:
      "Quality time in a beautiful setting where families can relax, connect, and create memories.",
    image: "/images/drive-14.webp",
  },
  {
    title: "Celebration Package",
    subtitle:
      "Elegant outdoor setups for birthdays, showers, graduations, and life's special occasions.",
    image: "/images/drive-11.webp",
  },
  {
    title: "Corporate Retreat",
    subtitle:
      "A refreshing venue for team bonding, meetings, workshops, and corporate events.",
    image: "/images/drive-4.jpg",
  },
  {
    title: "Solo Date",
    subtitle:
      "A peaceful escape to unwind, reflect, and enjoy your own company.",
    image: "/images/drive-7.jpg",
  },
  {
    title: "Romantic Proposal",
    subtitle:
      "A beautifully styled setting designed to make your proposal truly unforgettable.",
    image: "/images/drive-9.webp",
  },
  {
    title: "Photoshoot",
    subtitle:
      "Scenic outdoor spaces perfect for capturing timeless moments and stunning portraits.",
    image: "/images/drive-11.webp",
  },
  {
    title: "Wedding",
    subtitle:
      "Celebrate your love in a charming outdoor venue designed for intimate and memorable weddings.",
    image: "/images/drive-15.jpg",
  },
  {
    title: "Birthday",
    subtitle:
      "Make every birthday extraordinary with personalized décor and a vibrant atmosphere.",
    image: "/images/drive-9.webp",
  },
  {
    title: "Anniversary",
    subtitle:
      "Celebrate another chapter of love with a romantic and thoughtfully curated experience.",
    image: "/images/drive-10.webp",
  },
  {
    title: "Get-Together",
    subtitle:
      "Gather friends, family, or colleagues for unforgettable moments in a relaxed outdoor setting.",
    image: "/images/drive-11.webp",
  },
  {
    title: "Games",
    subtitle:
      "Enjoy fun outdoor games and activities that bring people together and create lasting memories.",
    image: "/images/drive-12.webp",
  },
  {
    title: "Delicacies (Small Chops)",
    subtitle:
      "Savor a selection of freshly prepared small chops and delicious treats for every occasion.",
    image: "/images/drive-8.jpg",
  },
  {
    title: "Mini Workplace",
    subtitle:
      "A quiet outdoor workspace where creativity, productivity, and fresh air come together.",
    image: "/images/drive-13.webp",
  },
  {
    title: "Craft",
    subtitle:
      "Express your creativity through hands-on craft experiences in an inspiring natural environment.",
    image: "/images/drive-7.jpg",
  },
]; const slides = [
  {
    image: "/images/banner.png",
    tag: "Welcome to TheYard",
    title: "Memorable, exciting, joyful, and historic",
    highlight: "moments",
  },
  {
    image: "/images/drive-6.jpg",
    tag: "Experience Luxury",
    title: "Unforgettable weddings, corporate events, and",
    highlight: "celebrations",
  },
  {
    image: "/images/drive-3.jpg",
    tag: "Our Spaces",
    title: "Elegant venues designed for your perfect",
    highlight: "occasion",
  },
  {
    image: "/images/drive-11.webp",
    tag: "Book Now",
    title: "Create memories that last a",
    highlight: "lifetime",
  },
];

const sectionReveal = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const revealItem = {
  hidden: { opacity: 0, y: 18, scale: 0.6 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

export default function Home() {
  const shouldReduceMotion = useReducedMotion();
  const paginationRef = useRef(null);
  const [paginationEl, setPaginationEl] = useState<HTMLDivElement | null>(null);
  const swiperRef = useRef<SwiperType | null>(null);

  const percs: { image: string; title: string; subtitle: string; }[] = [
    {
      image: "basket.png",
      title: "Beautiful Setups",
      subtitle: "Thoughtfully styled picnics for any occasion"
    },

    {
      image: "decor.png",
      title: "Decor & Styling",
      subtitle: "Balloons, florals & custom event styling."
    },
    {
      image: "private.png",
      title: "Private Spaces",
      subtitle: "Gazeebos & private dinning for intimate moments."
    },
    {
      image: "private.png",
      title: "Picture Perfect",
      subtitle: "Instagramable spots in aserene environment."
    },
  ];

  const [packages, setPackages] = useState<IPackage[]>([]);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [testimonials, setTestimonials] = useState<IReviewClient[]>([]);
  const [gallery, setGallery] = useState<IGalleryClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const featuredPackages = useMemo(() => {
    return [...packages].sort(() => Math.random() - 0.5).slice(0, 4);
  }, [packages]);

  useEffect(() => {
    (async () => {
      try {
        document.body.style.overflow = "hidden"; // Disable scrolling while loading
        const [
          packagesRes,
          eventsRes,
          testimonialsRes,
          galleryRes,
        ] = await Promise.all([
          axios.get(`/api/packages`),
          axios.get(`/api/events`),
          axios.get(`/api/reviews?status=published`),
          axios.get(`/api/gallery`),
        ]);

        setPackages(packagesRes.data.data.packages);
        setEvents(eventsRes.data.data.events);
        setTestimonials(testimonialsRes.data.data.reviews);
        setGallery(galleryRes.data.data.gallery.slice(0, 10));
      } catch (err) {
        console.error("Failed to load home page data ❌", err);
      } finally {
        document.body.style.overflow = "auto"; // Re-enable scrolling
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) {

    return <Loading />
  }
  return (
    <div >
      <div className="bg-black h-screen relative">
        <Swiper
          modules={[Pagination, Autoplay, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}

          speed={800}
          loop={true}
          pagination={
            paginationEl
              ? {
                el: paginationEl,
                clickable: true,
                bulletClass: "swiper-pagination-bullet",
                bulletActiveClass: "swiper-pagination-bullet-active",
              }
              : false
          }
          onBeforeInit={(swiper) => {
            // Assign the custom pagination element to Swiper
            if (paginationRef.current) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (swiper.params as any).pagination = {
                ...(typeof swiper.params.pagination === "object" ? swiper.params.pagination : {}),
                el: paginationRef.current,
              };
            }
          }}
          className="w-full h-full"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index} className="relative w-full h-full">
              <Image
                fill
                src={slide.image}
                alt={slide.tag}
                className="object-cover"
                priority={index === 0}
              />
              <div className="w-full h-full absolute bg-[linear-gradient(to_bottom,rgba(0,0,0,0.7)_0%,transparent_0%,rgba(0,0,0,1)_100%)]" />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Content overlay - stays static, only text changes via state if needed */}
        <div className="p-5 md:p-10 absolute bottom-10  md:flex justify-between w-full items-end  z-10 pointer-events-none ">
          <div className="md:w-[60%] mb-4 md:mb-0">
            <span className="bg-secondaryGreen text-lg flex py-1 px-5 w-fit mb-4">
              Welcome to The Yard
            </span>
            <h1 className={`text-white text-6xl font-playfair-display`}>
              Memorable, exciting, joyful, and historic{" "}
              <span className={`font-petit text-primaryBrown`}>
                moments
              </span>
            </h1>
          </div>

          {/* CUSTOM PAGINATION ICONS */}
          <div>
            <div
              ref={setPaginationEl}
            />
          </div>
        </div>
      </div>
      <motion.div
        className="flex items-center flex-col justify-center text-center py-20 relative px-7 md:px-0"
        initial={shouldReduceMotion ? false : "hidden"}
        whileInView={shouldReduceMotion ? undefined : "visible"}
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionReveal}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.h1
          className={`text-4xl font-lato mb-4 relative`}
          variants={revealItem}
          transition={{ duration: 0.55, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="font-bold">Where Serenity Meets</span>{" "} <br />
          <span className={`font-petit text-primaryBrown`}>
            celebration
          </span>

          <div className="w-20 h-20 absolute left-[-30%] top-[-30%] hidden md:block">
            <Image src={"/images/flower.png"} fill alt="Flower Icon" />
          </div>

          <div className="w-20 h-20 absolute right-[-30%] top-[-30%] hidden md:block">
            <Image src={"/images/flower_right1.png"} fill alt="Flower Icon" />
          </div>
        </motion.h1>
        <motion.p
          className={`font-lato font-medium md:w-[60%] `}
          variants={revealItem}
          transition={{ duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          Nestled in the heart of Independence Layout, Enugu, The Yard Picnic Park offers a serene, picturesque setting, perfect for picnics, intimate gatherings, and unforgettable celebrations.
        </motion.p>

        <motion.div
          className="w-full bg-primaryGreen my-10 grid grid-cols-1 md:grid-cols-4"
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView={shouldReduceMotion ? undefined : "visible"}
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {percs.map((item, key) => (
            <motion.div
              key={key}
              className={`p-14 font-lato flex flex-col gap-4 justify-center items-center relative`}
              variants={revealItem}
              transition={{ duration: 0.55, delay: key * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className="absolute h-full w-px opacity-40 right-0"
                style={{
                  background: "linear-gradient(to bottom, #012615 0%, #A27639 80%, #012615 100%)",
                }}
              ></div>
              <Image src={"/images/" + item.image} width={40} height={40} alt="Flower Icon" />
              <div>
                <h1 className="text-primaryBrown text-xl md:text-base">{item.title}</h1>
                <p className="text-white font-light text-lg md:text-sm">{item.subtitle} </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>



      <div
        className="relative h-20 translate-y-5"
        style={{
          background: "url(/images/trees_design.png) top / cover repeat-x",
        }}
      ></div>

      <div className="bg-[#EEE8DE] px-5 md:px-0 md:pl-10 py-10 grid grid-cols-1 md:grid-cols-4 gap-10">
        <motion.div
          className="flex flex-col justify-between gap-5 md:gap-0"
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView={shouldReduceMotion ? undefined : "visible"}
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionReveal}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.span
            className="bg-secondaryGreen text-sm md:flex py-1 px-5 mb-4 w-fit"
            variants={revealItem}
            transition={{ duration: 0.55, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            TheYard Experience
          </motion.span>

          <motion.h1
            className={`text-black text-4xl font-playfair-display font-medium`}
            variants={revealItem}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            Every Moment <br /> is <span className={`font-petit text-primaryBrown`}>special </span>
          </motion.h1>

          <motion.p
            className={`font-lato `}
            variants={revealItem}
            transition={{ duration: 0.55, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
          >
            From romantic dates to birthdays and special occasions, we create the perfect setting for your most cherished moments
          </motion.p>

          <motion.div
            variants={revealItem}
            transition={{ duration: 0.55, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link href={"/packages"} className="flex gap-3 bg-primaryGreen py-3 px-6 text-sm items-center text-white w-fit">
              View Packages
              <ArrowRight />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="md:col-span-3"
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView={shouldReduceMotion ? undefined : "visible"}
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionReveal}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <Swiper
            modules={[Autoplay, FreeMode]}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 3,
                spaceBetween: 16
              },
            }}
            spaceBetween={16}          // gap-4 = 16px
            loop={true}                // infinite loop
            freeMode={true}            // enables drag with momentum
            grabCursor={true}          // shows grab cursor on hover
            simulateTouch={true}       // enables mouse drag
            touchRatio={1}
            touchAngle={45}
            threshold={5}
            resistance={true}
            resistanceRatio={0.85}
            autoplay
            className=" h-120 md:h-95 w-full"
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
          >
            {services.map((item, index) => (
              <SwiperSlide key={index} className="h-full">
                <Link href={`/packages/`} className="h-full">
                  <motion.div
                    className="h-full relative text-white p-4 flex items-end"
                    variants={revealItem}
                    initial={shouldReduceMotion ? false : "hidden"}
                    whileInView={shouldReduceMotion ? undefined : "visible"}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="relative z-20 flex flex-col w-full gap-4 justify-end self-stretch">
                      <div className="flex flex-col gap-1 w-[80%] md:w-full">
                        <p className="font-playfair-display text-xl font-semibold">{item.title}</p>
                        <p className="font-inter text-sm h-5 ">{item.subtitle.length > 100 ? item.subtitle.slice(0, 100) + "..." : item.subtitle}</p>
                      </div>
                      <div className="flex w-full justify-end">
                        <Image width={30} height={30} alt="" src={"/images/arrow-right.png"} />
                      </div>
                    </div>
                    <Image src={item.image} fill alt="" className="object-cover" />
                    <div className="w-full h-full left-0 top-0 bg-black/40 absolute"></div>
                  </motion.div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>

        </motion.div>
      </div>

      <div className=" bg-[#EEE8DE] md:bg-transparent">
        <div className="p-5 md:p-10">
          <div className="md:px-20 flex flex-col md:flex-row items-center md:justify-between gap-6  mb-10">
            <div>
              <h1 className={`font-semibold text-2xl italic font-playfair-display  relative text-center md:text-left`}>Testimonials

                <Image width={100} height={100} alt="" src={"/images/paint_design.png"} className="object-contain absolute left-0 md:block hidden" />
              </h1>


              <p className={`font-lato text-[#5A5A53] md:mt-2 `}>See what our clients say about us...</p>
            </div>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className={"border-[1.4px] py-2 px-6 border-primaryGreen text-primaryGreen font-semibold font-lato cursor-pointer"}
            >
              Write a review
            </button>
          </div>



          <Swiper
            modules={[Autoplay, FreeMode]}
            slidesPerView={1}
            spaceBetween={0}
            breakpoints={{ 720: { slidesPerView: 3, spaceBetween: 16 } }}
            loop={true}
            freeMode={true}
            grabCursor={true}
            simulateTouch={true}
            touchRatio={1}
            touchAngle={45}
            threshold={5}
            resistance={true}
            resistanceRatio={0.85}
            className="w-full h-60" // fixed height instead of h-full
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
          >
            {[...testimonials].sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            ).map((testimony, index) => (
              <SwiperSlide key={index} className="relative w-full h-full">
                <div className={"bg-white p-10 h-full flex flex-col justify-between gap-6 font-inter"}>
                  <p className="h-30 no-scroll overflow-auto">{testimony.comment}</p>
                  <p className="font-semibold">{testimony.name}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="flex justify-center my-4 gap-4">
            {/* Go left */}
            <div
              className="h-14 w-14 bg-[#EDF0EE] flex items-center justify-center cursor-pointer"
              onClick={() => swiperRef.current?.slidePrev()}
            >
              <Image width={25} height={25} src={"/images/nav-arrow-left.png"} alt="" />
            </div>

            {/* Go right */}
            <div
              className="h-14 w-14 bg-[#EDF0EE] flex items-center justify-center cursor-pointer"
              onClick={() => swiperRef.current?.slideNext()}
            >
              <Image width={25} height={25} src={"/images/nav-arrow-right.png"} alt="" />
            </div>
          </div>
        </div>


        <div
          className="relative h-20 translate-y-5"
          style={{
            background: "url(/images/trees_design_green.png) top / cover repeat-x",
          }}
        ></div>
        <div className="bg-primaryGreen px-10 py-10 ">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-6">
            <motion.div
              className="w-full md:w-[40%]"
              initial={shouldReduceMotion ? false : "hidden"}
              whileInView={shouldReduceMotion ? undefined : "visible"}
              viewport={{ once: true, amount: 0.2 }}
              variants={sectionReveal}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.h1
                className={`text-2xl font-playfair-display text-white`}
                variants={revealItem}
                transition={{ duration: 0.55, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              >
                Featured Packages
              </motion.h1>

              <motion.p
                className={`font-lato text-primaryBrown mt-2 `}
                variants={revealItem}
                transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                We don&apos;t just provide a venue; we create memorable experiences. Flexible spaces, unique experiences, your way.
              </motion.p>
            </motion.div>
            <motion.div
              variants={revealItem}
              transition={{ duration: 0.55, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href={"/packages"} className={"border py-2 px-6 bg-white text-primaryGreen font-semibold w-fit font-lato"}>
                Explore all packages
              </Link>
            </motion.div>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          // initial={shouldReduceMotion ? false : "hidden"}
          // whileInView={shouldReduceMotion ? undefined : "visible"}
          // viewport={{ once: true, amount: 0.2 }}
          // variants={staggerContainer}
          // transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {featuredPackages.map((service, index) => (
              <motion.div
                key={index}
                className={"border border-[#E9D9C0]/50 text-[#F6F6F6] p-3 grid gap-2  font-inter "}
                // variants={revealItem}
                transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="h-50 relative">
                  <Image src={service.imageUrl} fill alt="" className="object-cover" />
                </div>

                <div className="grid gap-2 ">
                  <p className="font-semibold text-lg font-playfair-display truncate">
                    {service.name}
                  </p>
                  <p className="font-lato text-[#FEF6EB] text-sm font-light  h-20">
                    {service.description?.length > 100 ? service.description.slice(0, 100) + "..." : service.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>



        </div>

        <div className="px-5 md:px-10 py-20 ">
          <motion.div
            className="flex justify-center items-center flex-col mb-20 gap-4"
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView={shouldReduceMotion ? undefined : "visible"}
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionReveal}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.h1
              className={`text-black text-4xl font-playfair-display font-semibold text-center`}
              variants={revealItem}
              transition={{ duration: 0.55, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            >
              Join our celebrating <span className={`font-petit text-primaryBrown capitalize font-light`}>events </span>
            </motion.h1>

            <motion.div
              variants={revealItem}
              transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href={"/events"} className={"flex gap-2 items-center border-[1.4px] py-2 px-6 bg-white text-primaryGreen font-medium font-lato"}>
                Explore all events
                <ArrowRight />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3"
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView={shouldReduceMotion ? undefined : "visible"}
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {events.slice(0, 3).map((event, index) => {

              return <Link href={"/events"} key={index}>
                <motion.div
                  className={"p-3 grid gap-2  font-inter"}
                  variants={revealItem}
                  transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="h-50 relative">
                    <Image src={event.images[0]} fill alt="" className="object-cover" />
                  </div>

                  <div className="grid gap-1">
                    <p className={`font-semibold text-lg font-playfair-display text-primaryGreen`}>{event.title}</p>
                    <p className={`font-lato text-[#4B6450] text-sm font-light`}>{event.description}</p>
                    <p className={`font-lato text-primaryGreen text-sm mt-6 font-medium`}>
                      {new Date(event.date).toLocaleDateString("en-us", { dateStyle: "medium" })}
                    </p>
                  </div>
                </motion.div></Link>
            })}
          </motion.div>



        </div>

        <div
          className="relative h-20 translate-y-5"
          style={{
            background: "url(/images/ourgallery_design_1.png) top / cover repeat-x",
          }}
        ></div>


        <div className="bg-[#EAF6EA] px-5 md:px-10 pt-20 pb-60 grid gap-10">
          <motion.div
            className="flex flex-col md:flex-row md:justify-between md:items-center gap-3"
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView={shouldReduceMotion ? undefined : "visible"}
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionReveal}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex flex-col justify-between">
              <motion.span
                className="text-sm flex py-1 mb-4"
                variants={revealItem}
                transition={{ duration: 0.55, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              >
                Our Gallery
              </motion.span>

              <motion.h1
                className={`text-black text-4xl font-playfair-display font-medium mb-2`}
                variants={revealItem}
                transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                Unforgettable <span className={`font-petit text-primaryBrown`}>Moments </span>
              </motion.h1>

              <motion.p
                className={`font-lato text-sm `}
                variants={revealItem}
                transition={{ duration: 0.55, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
              >
                Browse the experiences we’ve created              </motion.p>
            </div>

            <motion.div
              variants={revealItem}
              transition={{ duration: 0.55, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href={"/gallery"} className="flex gap-3 bg-primaryGreen py-3 px-6 text-sm items-center text-white w-fit capitalize">
                View full gallery
                <ArrowRight />
              </Link>
            </motion.div>
          </motion.div>

          <BentoGrid images={gallery.map((item) => item.imageUrl)} isMotion={true} />

        </div>


      </div>

      <ReviewModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmitted={() => undefined}
      />




    </div>
  );
}