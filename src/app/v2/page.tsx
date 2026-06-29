"use client";
import { Inter, Lato, Petit_Formal_Script, Playfair_Display } from "next/font/google";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Pagination, Autoplay, EffectFade, FreeMode } from "swiper/modules";
// import { Autoplay, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useRef, useState } from "react";
export const PlayFair = Playfair_Display({
    subsets: ["latin"],
    style: ["italic", "normal"],
    weight: ["400", "700"]
});


export const Lato_Font = Lato({
    weight: ["700", "400", "300",]
})




export const Petit = Petit_Formal_Script({
  weight: "400",
  subsets: ["latin"],
});


export const Inter_Font = Inter({
  subsets: ["latin"],
  weight: ["200", "400"]
})

const slides = [
  {
    image: "/images/banner.png",
    tag: "Welcome to TheYard",
    title: "Memorable, exciting, joyful, and historic",
    highlight: "moments",
  },
  {
    image: "/images/banner.png",
    tag: "Experience Luxury",
    title: "Unforgettable weddings, corporate events, and",
    highlight: "celebrations",
  },
  {
    image: "/images/banner.png",
    tag: "Our Spaces",
    title: "Elegant venues designed for your perfect",
    highlight: "occasion",
  },
  {
    image: "/images/banner.png",
    tag: "Book Now",
    title: "Create memories that last a",
    highlight: "lifetime",
  },
];

export default function Home() {
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

  const packages: { image: string; title: string; subtitle: string }[] = [
    {
      image: "movie_night.jpg",
      title: "Movie Night",
      subtitle: "Romantic setup for you  and your special someone."
    },
    {
      image: "movie_night.jpg",
      title: "Movie Night",
      subtitle: "Romantic setup for you  and your special someone."
    },
    {
      image: "movie_night.jpg",
      title: "Movie Night",
      subtitle: "Romantic setup for you  and your special someone."
    },
    {
      image: "movie_night.jpg",
      title: "Movie Night",
      subtitle: "Romantic setup for you  and your special someone."
    }
  ]

  const testimonails: { name: string; testimony: string }[] = [
    {
      name: "Chiamaka & Femi",
      testimony: "The setup was more beautiful than i imagined. My partner was so surprised and  speechless."
    },
    {
      name: "Chiamaka & Femi",
      testimony: "The setup was more beautiful than i imagined. My partner was so surprised and  speechless."
    },
    {
      name: "Chiamaka & Femi",
      testimony: "The setup was more beautiful than i imagined. My partner was so surprised and  speechless."
    },
    {
      name: "Chiamaka & Femi",
      testimony: "The setup was more beautiful than i imagined. My partner was so surprised and  speechless."
    }
  ]

  const services: { title: string; subtitle: string; cta: string; image: string; }[] = [
    { title: "Picnic Spaces", subtitle: "Relax in nature with our charming picnic setups.", cta: "Book a space now", image: "https://images.pexels.com/photos/4577574/pexels-photo-4577574.jpeg" },
    { title: "Picnic Spaces", subtitle: "Relax in nature with our charming picnic setups.", cta: "Book a space now", image: "https://images.pexels.com/photos/4577574/pexels-photo-4577574.jpeg" },
    { title: "Picnic Spaces", subtitle: "Relax in nature with our charming picnic setups.", cta: "Book a space now", image: "https://images.pexels.com/photos/4577574/pexels-photo-4577574.jpeg" },
    { title: "Picnic Spaces", subtitle: "Relax in nature with our charming picnic setups.", cta: "Book a space now", image: "https://images.pexels.com/photos/4577574/pexels-photo-4577574.jpeg" },
    { title: "Picnic Spaces", subtitle: "Relax in nature with our charming picnic setups.", cta: "Book a space now", image: "https://images.pexels.com/photos/4577574/pexels-photo-4577574.jpeg" },
    { title: "Picnic Spaces", subtitle: "Relax in nature with our charming picnic setups.", cta: "Book a space now", image: "https://images.pexels.com/photos/4577574/pexels-photo-4577574.jpeg" }

  ];
  const events: { title: string; subtitle: string; date: string; image: string; }[] = [
    {
      title: "Summer Tech Expo",
      subtitle: "We don't just provide a venue; we create Flexible spaces, unique experiences, your way.",
      date: "2026-07-15",
      image: "https://images.pexels.com/photos/4577574/pexels-photo-4577574.jpeg"
    },
    {
      title: "Startup Networking Night",
      subtitle: "We don't just provide a venue; we create Flexible spaces, unique experiences, your way.",
      date: "2026-08-02",
      image: "https://images.pexels.com/photos/4577574/pexels-photo-4577574.jpeg"
    },
    {
      title: "Design Thinking Workshop",
      subtitle: "We don't just provide a venue; we create Flexible spaces, unique experiences, your way.",
      date: "2026-08-18",
      image: "https://images.pexels.com/photos/4577574/pexels-photo-4577574.jpeg"
    },
    {
      title: "Community Hackathon",
      subtitle: "We don't just provide a venue; we create Flexible spaces, unique experiences, your way.",
      date: "2026-09-05",
      image: "https://images.pexels.com/photos/4577574/pexels-photo-4577574.jpeg"
    },
    {
      title: "Digital Marketing Summit",
      subtitle: "We don't just provide a venue; we create Flexible spaces, unique experiences, your way.",
      date: "2026-09-22",
      image: "https://images.pexels.com/photos/4577574/pexels-photo-4577574.jpeg"
    },
  ];


  return (
    <div >
      <div className="bg-black h-[90vh] md:h-[80vh] relative">
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
        <div className="p-5 md:p-10 absolute bottom-20 md:bottom-0 md:flex justify-between w-full items-end  z-10 pointer-events-none ">
          <div className="md:w-[40%] mb-4 md:mb-0">
            <span className="bg-secondaryGreen text-sm flex py-1 px-5 w-fit mb-4">
              Welcome to TheYard
            </span>
            <h1 className={`text-white text-4xl ${PlayFair.className}`}>
              Memorable, exciting, joyful, and historic{" "}
              <span className={`${Petit.className} text-primaryBrown`}>
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
      <div className="flex items-center flex-col justify-center text-center py-20 relative bg-[#FDFBF9] px-7 md:px-0">
        <h1 className={` text-4xl ${Lato_Font.className} mb-4 relative`}>
          <span className="font-bold">Where Serenity Meets</span>{" "} <br />
          <span className={`${Petit.className} text-primaryBrown`}>
            celebration
          </span>

          <div className="w-20 h-20 absolute left-[-30%] top-[-30%] hidden md:block">
            <Image src={"/images/flower.png"} fill alt="Flower Icon" />
          </div>

          <div className="w-20 h-20 absolute right-[-30%] top-[-30%] hidden md:block">
            <Image src={"/images/flower_right1.png"} fill alt="Flower Icon" />
          </div>
        </h1>
        <p className={`${Lato_Font.className} font-medium md:w-[60%] `}>Nestled in the heart of Independence Layout, Enugu, The Yard Picnic Park offers a serene, picturesque setting, perfect for picnics, intimate gatherings, and unforgettable celebrations.</p>

        <div className="w-full bg-primaryGreen  my-10 grid grid-cols-1 md:grid-cols-4">
          {
            percs.map((item, key) => <div key={key} className={`p-14 ${Lato_Font.className} flex flex-col gap-4 justify-center items-center relative`}>
              <div
                className="absolute h-full w-px  opacity-40 right-0"
                style={{
                  background: "linear-gradient(to bottom, #012615 0%, #A27639 80%, #012615 100%)",
                }}
              ></div>
              <Image src={"/images/" + item.image} width={40} height={40} alt="Flower Icon" />
              <div>
                <h1 className="text-primaryBrown text-xl md:text-base">{item.title}</h1>
                <p className="text-white font-light text-lg md:text-sm">{item.subtitle} </p>
              </div>


            </div>)
          }
        </div>




      </div>

      <div
        className="relative h-20 translate-y-5"
        style={{
          background: "url(/images/trees_design.png) top / cover repeat-x",
        }}
      ></div>

      <div className="bg-[#EEE8DE] px-5 md:px-0  md:pl-10 py-10 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="flex flex-col justify-between gap-5 md:gap-0">
          <span className="bg-secondaryGreen text-sm md:flex py-1 px-5  mb-4 w-fit">
            TheYard Experience
          </span>

          <h1 className={`text-black text-4xl ${PlayFair.className} font-medium`}>
            Every Moment <br /> is   <span className={`${Petit.className} text-primaryBrown`}>special </span>
          </h1>

          <p className={`${Lato_Font.className} `}>From romantic dates to birthdays and special occasions, we create the perfect setting for your most cherished moments</p>

          <Link href={"/"} className="flex gap-3 bg-primaryGreen py-3 px-6 text-sm items-center text-white  w-fit">
            View Packages
            <ArrowRight />
          </Link>
        </div>


        <div className="md:col-span-3">
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
            className=" h-95 w-full"
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
          >
            {packages.map((item, index) => (
              <SwiperSlide key={index} className="h-full">
                <div className="h-full relative text-white p-4 flex items-end">
                  <div className="relative z-20 flex flex-col gap-4">
                    <div className="flex flex-col gap-1 w-[80%] md:w-full">
                      <p className={`${PlayFair.className} text-xl font-semibold`}>{item.title}</p>
                      <p className={`${Inter_Font.className} text-sm`}>{item.subtitle}</p>
                    </div>
                    <div className="flex justify-end">
                      <Image width={30} height={30} alt="" src={"/images/arrow-right.png"} />
                    </div>
                  </div>
                  <Image src={"/images/" + item.image} fill alt="" className="object-cover" />
                  <div className="w-full h-full left-0 top-0 bg-black/40 absolute"></div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

        </div>
      </div>

      <div className=" bg-[#EEE8DE] md:bg-transparent">
        <div className="p-5 md:p-10">
          <div className="md:px-20 flex flex-col md:flex-row items-center md:justify-between gap-6  mb-10">
            <div>
              <h1 className={`font-semibold text-2xl italic ${PlayFair.className}  relative text-center md:text-left`}>Testimonials

                <Image width={100} height={100} alt="" src={"/images/paint_design.png"} className="object-contain absolute left-0 md:block hidden" />
              </h1>


              <p className={`${Lato_Font.className} text-[#5A5A53] md:mt-2 `}>See what our clients say about us...</p>
            </div>
            <Link href={"/"} className={" border-[1.4px] py-2 px-6  border-primaryGreen text-primaryGreen font-semibold" + Lato_Font.className}>
              Write a review
            </Link>
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
            className="w-full h-full"
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
          >
            {testimonails.map((testimony, index) => (
              <SwiperSlide key={index} className="relative w-full h-full">
                <div className={"bg-white md:bg-[#EEE8DE] p-10 grid gap-6 " + Inter_Font.className}>
                  <p>{testimony.testimony}</p>
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
        <div className="bg-primaryGreen  px-10 py-10 ">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-6">
            <div className="w-full  md:w-[40%]">
              <h1 className={` text-2xl  ${PlayFair.className} text-white`}>Featured Services </h1>

              <p className={`${Lato_Font.className} text-primaryBrown mt-2 `}>We don't just provide a venue; we create memorable experiences.
                Flexible spaces, unique experiences, your way.</p>
            </div>
            <Link href={"/"} className={" border-[1.4px] py-2 px-6  bg-white text-primaryGreen font-semibold w-fit " + Lato_Font.className}>
              Explore all services
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {services.map((service, index) => (<div key={index} className={"border border-[#E9D9C0]/50 text-[#F6F6F6] p-3 grid gap-2 " + Inter_Font.className}>
              <div className="h-50 relative">
                <Image src={service.image} fill alt="" className="object-cover" />
              </div>

              <div className="grid gap-2">
                <p className={`font-semibold text-lg ${PlayFair.className}`}>{service.title}</p>
                <p className={`${Lato_Font.className} text-[#FEF6EB] text-sm font-light`}>{service.subtitle}</p>
                <p className={`${Lato_Font.className} text-white/50 text-xs mt-6`}>{service.cta}</p>
              </div>

            </div>))}
          </div>

          {/* <Swiper
            modules={[Autoplay, FreeMode]}
            slidesPerView={1}
            spaceBetween={10}
            breakpoints={{768: {
              slidesPerView: 4,

            }}}
            loop={true}
            freeMode={true}
            grabCursor={true}
            simulateTouch={true}
            touchRatio={1}
            touchAngle={45}
            threshold={5}
            resistance={true}
            resistanceRatio={0.85}
            className="w-full h-full"
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
          >
            {services.map((service, index) => (
              <SwiperSlide key={index} className="relative w-full h-full">

               
              </SwiperSlide>
            ))}
          </Swiper> */}

        </div>

        <div className=" px-5 md:px-10 py-10 ">
          <div className="flex justify-center items-center flex-col mb-20 gap-4">
            <h1 className={`text-black text-4xl ${PlayFair.className} font-medium text-center`}>
              Join  our  celebrating   <span className={`${Petit.className} text-primaryBrown capitalize font-light`}>events </span>
            </h1>

            <Link href={"/"} className={" flex gap-2 items-center border-[1.4px] py-2 px-6  bg-white text-primaryGreen font-semibold " + Lato_Font.className}>
              Explore all events
              <ArrowRight />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 ">
            {events.map((event, index) => (
              <div className={"  p-3 grid gap-2 " + Inter_Font.className} key={index}>
                <div className="h-50 relative">
                  <Image src={event.image} fill alt="" className="object-cover" />
                </div>

                <div className="grid gap-1">
                  <p className={`font-semibold text-lg ${PlayFair.className} text-primaryGreen`}>{event.title}</p>
                  <p className={`${Lato_Font.className} text-[#4B6450] text-sm font-light`}>{event.subtitle}</p>
                  <p className={`${Lato_Font.className} text-primaryGreen text-sm mt-6 font-medium`}>
                    {new Date(event.date).toLocaleDateString("en-us", { dateStyle: "medium" })}
                    </p>
                </div>

              </div>
            ))}
          </div>


          <Swiper
            modules={[Autoplay, FreeMode]}
            slidesPerView={3}
            spaceBetween={16}
            loop={true}
            freeMode={true}
            grabCursor={true}
            simulateTouch={true}
            touchRatio={1}
            touchAngle={45}
            threshold={5}
            resistance={true}
            resistanceRatio={0.85}
            className="w-full h-full"
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
          >

          </Swiper>
        </div>

        <div
          className="relative h-20 translate-y-5"
          style={{
            background: "url(/images/ourgallery_design_1.png) top / cover repeat-x",
          }}
        ></div>


        <div className="bg-[#EAF6EA] px-5 md:px-10 py-20 grid  gap-10">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 ">
            <div className="flex flex-col justify-between">
              <span className=" text-sm flex py-1  mb-4">
                Our Gallery
              </span>

              <h1 className={`text-black text-4xl ${PlayFair.className} font-medium mb-2`}>
                unForgettable     <span className={`${Petit.className} text-primaryBrown`}>Moments </span>
              </h1>

              <p className={`${Lato_Font.className} text-sm `}>From intimate dates to joyful celebrations, every setup is crafted to create lasting memories.</p>


            </div>

            <Link href={"/"} className="flex gap-3 bg-primaryGreen py-3 px-6 text-sm items-center text-white  w-fit capitalize">
              View full gallery
              <ArrowRight />
            </Link>
          </div>

          <div className="grid grid-cols-6 gap-2 md:gap-3">


            <div className="col-span-6 md:row-span-2 md:col-span-2 relative  rounded-lg bg-white flex items-center justify-center min-h-50 md:min-h-36.25">
              <Image src={"https://images.pexels.com/photos/10071290/pexels-photo-10071290.jpeg"} fill alt="" className="object-cover rounded-lg" />
            </div>


            <div className="col-span-6 md:col-span-1 relative flex items-center justify-center min-h-40 md:min-h-36.25">
              <Image src={"https://images.pexels.com/photos/10071290/pexels-photo-10071290.jpeg"} fill alt="" className="object-cover rounded-lg" />
            </div>
            <div className=" col-span-6 md:col-span-1  relative flex items-center justify-center min-h-30 md:min-h-36.25">
              <Image src={"https://images.pexels.com/photos/10071290/pexels-photo-10071290.jpeg"} fill alt="" className="object-cover rounded-lg" />
            </div>

            <div className="  col-span-6 md:col-span-1 relative  hidden md:flex  items-center justify-center min-h-40 md:min-h-36.25">
              <Image src={"https://images.pexels.com/photos/10071290/pexels-photo-10071290.jpeg"} fill alt="" className="object-cover rounded-lg" />
            </div>

            <div className= " col-span-6 md:col-span-1 relative hidden md:flex items-center justify-center min-h-30 md:min-h-36.25">
              <Image src={"https://images.pexels.com/photos/10071290/pexels-photo-10071290.jpeg"} fill alt="" className="object-cover rounded-lg" />
            </div>

            <div className="col-span-6 md:col-span-4  grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">

              <div className="relative flex items-center justify-center min-h-30 md:min-h-36.25">
                <Image src={"https://images.pexels.com/photos/10071290/pexels-photo-10071290.jpeg"} fill alt="" className="object-cover rounded-lg" />
              </div>

              <div className="relative flex items-center justify-center min-h-30 md:min-h-36.25">
                <Image src={"https://images.pexels.com/photos/10071290/pexels-photo-10071290.jpeg"} fill alt="" className="object-cover rounded-lg" />
              </div>

              <div className="relative flex items-center justify-center col-span-2  md:col-span-1  min-h-30 md:min-h-36.25">
                <Image src={"https://images.pexels.com/photos/10071290/pexels-photo-10071290.jpeg"} fill alt="" className="object-cover rounded-lg" />
              </div>
            </div>




          </div>



        </div>


      </div>





   
    </div>
  );
}