import HeaderTextComp from '@/components/v2/HeaderTextComp';
import { Inter, Lato, Petit_Formal_Script, Playfair_Display, Sen } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
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

const images: string[] = ["https://images.pexels.com/photos/12896324/pexels-photo-12896324.jpeg", "https://images.pexels.com/photos/12896324/pexels-photo-12896324.jpeg", "https://images.pexels.com/photos/12896324/pexels-photo-12896324.jpeg", "https://images.pexels.com/photos/12896324/pexels-photo-12896324.jpeg"]
const experiences: { image: string; title: string; subtitle: string; button: { label: string; url: string; } }[] = [
    {
        image: "https://images.pexels.com/photos/12896324/pexels-photo-12896324.jpeg", title: "Event Space Styling", subtitle: `At The Yard, we bring your events to life with beautiful, custom balloon decorations. 

                                    From birthdays and anniversaries to corporate events and intimate gatherings, we create designs that match your theme, mood, and style. 

                                    Whether you want a playful pop of color, elegant arrangements, or a full statement setup, our team takes care of every detail, making sure your event look effortlessly stunning.`, button: { label: "Join our upcoming event", url: "/" }
    },
    {
        image: "https://images.pexels.com/photos/12896324/pexels-photo-12896324.jpeg", title: "Event Space Styling", subtitle: `At The Yard, we bring your events to life with beautiful, custom balloon decorations. 

                                    From birthdays and anniversaries to corporate events and intimate gatherings, we create designs that match your theme, mood, and style. 

                                    Whether you want a playful pop of color, elegant arrangements, or a full statement setup, our team takes care of every detail, making sure your event look effortlessly stunning.`, button: { label: "Join our upcoming event", url: "/" }
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
    return (
        <div className='min-h-screen   space-y-10'>

            <HeaderTextComp pageName='About Us' subtitleText='The Yard Picnic Park was born from a desire to create an elegant, open-air sanctuary right in the city’s vibrant Independence Layout. We wanted a place where people could step away from the bustle of everyday life and reconnect with nature, friends, and loved ones.' titleStyledText='Story' titleText='Our TheYard' />

            <div className='grid grid-cols-1  md:grid-cols-2 md:px-10 gap-10 px-5  place-items-center'>
                {
                    images.map((image, index) => <div key={index} className='border-20 md:border-30 aspect-square w-full md:w-[70%] rounded-full relative border-primaryGreen'>
                        <Image
                            src={image}
                            fill
                            alt=""
                            className="object-cover rounded-full outline-4 outline-primaryBrown"
                            sizes="50vw"
                        />
                    </div>)
                }

                <div className='flex flex-col text-center items-center border py-14 px-5 md:px-30 md:pt-10 gap-3 md:pb-30 border-[#F2E3C6] relative'>
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

                </div>

                <div className='flex flex-col text-center items-center border py-14 px-5 md:px-30 md:pt-10 gap-3 md:pb-30 border-[#F2E3C6] relative'>
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

                </div>
            </div>

            <div className='p-5 md:p-10'>
                <p className={`text-xl text-center ${Lato_Font.className} text-primaryGreen text-sm`}>Experiences we provide</p>

                <div className='flex flex-col  justify-center items-center space-y-10 md:space-y-30 py-20'>
                    {experiences.map((experience, index) => <div key={index} className='grid grid-cols-1 md:grid-cols-2 w-full md:w-[80%] gap-10 relative'>
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
                    </div>)}
                </div>

            </div>

            <div className="flex items-center justify-center gap-4 py-10 px-5 md:px-10">
                <div className="w-[60%] md:w-[30%] flex items-center flex-col justify-center gap-4">
                    <h1 className={`text-primaryGreen font-medium text-2xl  ${PlayFair.className} text-center capitalize `}>
                        Customize your  {" "}
                        <span className={`${Petit.className} text-primaryBrown`}>
                            Experience
                        </span>
                    </h1>

                    <Link href={"/"} className={`bg-primaryGreen py-3 px-6 text-white text-sm ${SEN.className} w-full text-center`}>
                        Book your experience
                    </Link>
                </div>


            </div>
        </div>
    )
}
