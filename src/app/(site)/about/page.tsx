"use client";
import HeaderTextComp from '@/components/v2/HeaderTextComp';
import { Lato, Petit_Formal_Script, Playfair_Display, Sen } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
export const PlayFair = Playfair_Display({
    subsets: ["latin"],
    style: ["italic", "normal"],
    weight: ["400", "700"]
});

export const Lato_Font = Lato({
    weight: ["700", "400", "300"]
})

export const SEN = Sen({
    weight: ["400", "500"]
})

export const Petit = Petit_Formal_Script({
    weight: "400",
    subsets: ["latin"],
});

const images: string[] = ["/images/drive-6.jpg", "/images/drive-7.jpg", "/images/drive-10.webp", "/images/drive-12.webp"]
const experiences: { image: string; title: string; subtitle: string; button: { label: string; url: string; } }[] = [

    {
        image: "/images/drive-9.webp", title: "Event  Styling", 
        subtitle: `Transform your vision into a beautifully curated experience with our professional event styling service. Whether you're planning a romantic date, birthday, anniversary, proposal, bridal shower, baby shower, corporate gathering, or intimate wedding, we design every detail to reflect your style and occasion. From elegant décor and themed setups to seating arrangements, lighting, floral accents, and personalized touches, we create memorable spaces that leave lasting impressions.
`,

        button: { label: "Join our upcoming event", url: "/events" }
    },

    {
        image: "/images/drive-15.jpg", title: "Games", subtitle: `Bring energy and excitement to your gathering with our selection of outdoor and indoor games and recreational activities. Perfect for families, friends, couples, and corporate teams, our games encourage laughter, friendly competition, and meaningful connection. Whether you're planning a casual picnic or a team-building event, we provide a fun and engaging atmosphere that makes every visit more enjoyable.`, button: { label: "Join our upcoming event", url: "/events" }
    },
    {
        image: "/images/drive-8.jpg", title: "Delicacies (Small Chops)", subtitle: `Complete your experience with a delicious assortment of freshly prepared small chops and light refreshments. From classic favorites to premium selections, our catering is perfect for picnics, birthdays, proposals, corporate events, and private celebrations. Beautifully presented and made with quality ingredients, our delicacies add the perfect finishing touch to every occasion, ensuring your guests enjoy every bite.`, button: { label: "Join our upcoming event", url: "/events" }
    }
]

function addLineBreaks(text: string) {
    return text.split('.').map((sentence, index, array) => (
        <span key={index}>
            {sentence}
            {index < array.length - 1 && '.'}
            {index < array.length - 1 && <>
                <br />
                <br />
            </>}
        </span>
    ));
}


export default function AboutPage() {
    const shouldReduceMotion = useReducedMotion();

    const sectionReveal = {
        hidden: { opacity: 0, y: 18, filter: 'blur(6px)' },
        visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
    };

    const itemReveal = {
        hidden: { opacity: 0, y: 16, filter: 'blur(6px)' },
        visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
    };

    return (
        <div className='min-h-screen   space-y-10 '>

            <motion.div
                initial={shouldReduceMotion ? false : 'hidden'}
                whileInView={shouldReduceMotion ? undefined : 'visible'}
                viewport={{ once: true, amount: 0.2 }}
                variants={sectionReveal}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
                <HeaderTextComp pageName='About Us' subtitleText='The Yard Picnic Park was born from a desire to create an elegant, open-air sanctuary right in the city’s vibrant Independence Layout. We wanted a place where people could step away from the bustle of everyday life and reconnect with nature, friends, and loved ones.' titleStyledText='Story' titleText='Our TheYard' />
            </motion.div>

            <div className='grid grid-cols-1  md:grid-cols-2 md:px-10 gap-10 px-5  place-items-center'>
                {
                    images.map((image, index) => <motion.div key={index} className='border-20 md:border-30 aspect-square w-full md:w-[70%] rounded-full relative border-primaryGreen' initial={shouldReduceMotion ? false : 'hidden'} whileInView={shouldReduceMotion ? undefined : 'visible'} viewport={{ once: true, amount: 0.2 }} variants={itemReveal} transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}>
                        <Image
                            src={image}
                            fill
                            alt=""
                            className="object-cover rounded-full outline-4 outline-primaryBrown"
                            sizes="50vw"
                        />
                    </motion.div>)
                }

                <motion.div className='flex flex-col text-center items-center border py-14 px-5 md:px-30 md:pt-10 gap-3 md:pb-30 border-[#F2E3C6] relative' initial={shouldReduceMotion ? false : 'hidden'} whileInView={shouldReduceMotion ? undefined : 'visible'} viewport={{ once: true, amount: 0.2 }} variants={itemReveal} transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}>
                    {/* <div className='border w-full h-full border'></div> */}
                    <h1 className={`text-[30px] ${PlayFair.className} font-bold relative md:w-fit`}>Our Mission                 <Image width={100} height={100} alt="" src={"/images/paint_design.png"} className="object-contain absolute right-0 md:block hidden" />
                    </h1>
                    <p className={`text-base ${Lato_Font.className}`}>To craft memorable outdoor experiences in a serene, nature-inspired setting that blends elegance with relaxation.</p>

                    <Image
                        src="/images/flower_mission_2.png"
                        width={90}
                        height={90}
                        alt=""
                        className="object-contain absolute right-6 bottom-6"
                        sizes="50vw"
                    />

                </motion.div>

                <motion.div className='flex flex-col text-center items-center border py-14 px-5 md:px-30 md:pt-10 gap-3 md:pb-30 border-[#F2E3C6] relative' initial={shouldReduceMotion ? false : 'hidden'} whileInView={shouldReduceMotion ? undefined : 'visible'} viewport={{ once: true, amount: 0.2 }} variants={itemReveal} transition={{ duration: 0.55, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}>
                    {/* <div className='border w-full h-full border'></div> */}
                    <h1 className={`text-[30px] ${PlayFair.className} font-bold relative w-fit`}>Our Vision                 <Image width={100} height={100} alt="" src={"/images/paint_design.png"} className="object-contain absolute right-0 md:block hidden" />
                    </h1>
                    <p className={`text-base ${Lato_Font.className}`}>To be Enugu’s go-to destination for intimate celebrations, peaceful escapes, and creative gatherings.</p>

                    <Image
                        src="/images/flower_mission_2.png"
                        width={90}
                        height={90}
                        alt=""
                        className="object-contain absolute right-6 bottom-6"
                        sizes="50vw"
                    />

                </motion.div>
            </div>

            <motion.div className='p-5 md:p-10' initial={shouldReduceMotion ? false : 'hidden'} whileInView={shouldReduceMotion ? undefined : 'visible'} viewport={{ once: true, amount: 0.2 }} variants={sectionReveal} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                <p className={`text-xl text-center ${Lato_Font.className} text-primaryGreen text-sm`}>Experiences we provide</p>

                <div className='flex flex-col  justify-center items-center space-y-10 md:space-y-30 py-20'>
                    {experiences.map((experience, index) => <motion.div key={index} className='grid grid-cols-1 md:grid-cols-2 w-full md:w-[80%] gap-10 relative' initial={shouldReduceMotion ? false : 'hidden'} whileInView={shouldReduceMotion ? undefined : 'visible'} viewport={{ once: true, amount: 0.2 }} variants={itemReveal} transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}>
                        <div className={` h-120 relative ${index % 2 === 0 ? "md:order-1" : "md:order-2"}`}>
                            <Image
                                src={experience.image}
                                fill
                                alt=""
                                className="object-cover "
                                sizes="50vw"
                            />
                        </div>

                        <div className={`space-y-4 ${index % 2 === 0 ? "md:order-2" : "md:order-1"}`}>
                            <h1 className={`text-xl ${PlayFair.className} font-medium relative w-fit`}>{experience.title}              <Image width={50} height={100} alt="" src={"/images/paint_design.png"} className="object-contain absolute right-0 md:block hidden" />
                            </h1>

                            <p className={`${Lato_Font.className} text-sm`}>

                                {addLineBreaks(experience.subtitle)}
                            </p>

                            <Link href={experience.button.url} className={`border border-primaryGreen py-3 px-6 text-primaryGreen text-sm ${SEN.className} my-10 block md:w-fit w-[80%] text-center`}>
                                {experience.button.label}
                            </Link>
                        </div>

                        <Image width={100} height={100} alt="" src={"/images/about_mobile_flower.png"} className="object-contain absolute -bottom-6 right-0 md:hidden block  " />
                    </motion.div>)}
                </div>

            </motion.div>

            <motion.div className="flex items-center justify-center gap-4 py-10 px-5 md:px-10" initial={shouldReduceMotion ? false : 'hidden'} whileInView={shouldReduceMotion ? undefined : 'visible'} viewport={{ once: true, amount: 0.2 }} variants={sectionReveal} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                <div className="w-[60%] md:w-[30%] flex items-center flex-col justify-center gap-4">
                    <h1 className={`text-primaryGreen font-medium text-2xl  ${PlayFair.className} text-center capitalize `}>
                        Customize your  {" "}
                        <span className={`${Petit.className} text-primaryBrown`}>
                            Experience
                        </span>
                    </h1>

                    <Link href={"/booking/calendar"} className={`bg-primaryGreen py-3 px-6 text-white text-sm ${SEN.className} w-full text-center`}>
                        Book your experience
                    </Link>
                </div>


            </motion.div>
        </div>
    )
}
