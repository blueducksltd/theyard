import { Lato_Font, PlayFair } from '@/app/v2/page';
import {  Mail,  MapPin, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { RiInstagramLine, RiTiktokLine, RiWhatsappLine } from 'react-icons/ri';
import { SlSocialFacebook } from 'react-icons/sl';


export default function Footer() {

    return (
        <footer className='bg-white pt-10 '>
            <div
                className="relative h-20 translate-y-5 md:translate-y-1"
                style={{
                    background: "url(/images/trees_design_footer.png) top / contain repeat-x",
                }}
            ></div>


            <div className="bg-primaryGreen p-7  md:p-14  grid  md:gap-10 text-white relative">
                <div className='flex items-center justify-center flex-col'>
                    <h1 className={`text-primaryBrown text-xl ${PlayFair.className} font-medium text`}>
                        Subscribe to our Newsletter
                    </h1>
                    <p className={`${Lato_Font.className} text-sm text-center`}>Join our picnic lovers list for updates, offers, and event inspiration.</p>
                    <div className='grid grid-cols-1 md:grid-cols-2 w-full md:w-[60%] mt-10 gap-y-4'>
                        <div className='h-14 border flex items-center p-4'>
                            <input type="text" placeholder='Firstname' className='h-full outline-none' />
                        </div>

                        <div className='h-14 border flex items-center p-4'>
                            <input type="text" placeholder='Lastname' className='h-full outline-none' />
                        </div>

                        <div className='  items-center  md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-y-4'>
                            <div className='h-14 border flex items-center p-4 md:col-span-2'>
                                <input type="email" placeholder='Email' className='h-full outline-none  ' />
                            </div>

                            <button className='bg-white h-full text-black text-sm py-4'>Accept our policy & Subscribe</button>
                        </div>

                    </div>

                </div>

                <div className='pt-10'>
                    <div className='grid grid-cols-1 md:grid-cols-5 gap-10 py-10'>

                        <div className='relative flex flex-col gap-5 grid-cols-1 md:col-span-2 pr-20'>
                            <h1 className={`font-semibold text-xl  relative ${PlayFair.className} w-fit text-primaryBrown md:text-white`}>Quick Introduction:
                                <Image width={100} height={100} alt="" src={"/images/paint_design.png"} className="object-contain right-0 absolute" />


                            </h1>
                            <p className={`${Lato_Font.className} text-white/50 mt-2 text-sm font-light`}>
                                At The Yard, we believe every moment is worth celebrating. Whether it's a quiet picnic, a romantic date, or a joyful gathering with friends, our beautiful green spaces and curated setups create memories to cherish forever.
                            </p>

                        </div>

                        <div className='flex flex-col gap-5'>
                            <p className={`${Lato_Font.className} text-primaryBrown text-sm font-light relative w-fit uppercase`}>
                                Menus
                                {/* <Image width={100} height={100} alt="" src={"/images/paint_design.png"} className="object-contain right-0 absolute" /> */}

                            </p>

                            <Link href={"/"} className={`${Lato_Font.className}`}>
                                Packages
                            </Link>
                            <Link href={"/"} className={`${Lato_Font.className}`}>
                                Events
                            </Link>
                            <Link href={"/"} className={`${Lato_Font.className}`}>
                                About
                            </Link>
                            <Link href={"/"} className={`${Lato_Font.className}`}>
                                Gallery
                            </Link>

                        </div>

                        <div className='flex flex-col gap-5'>
                            <p className={`${Lato_Font.className} text-primaryBrown text-sm font-light relative w-fit uppercase`}>
                                Contact us
                                {/* <Image width={100} height={100} alt="" src={"/images/paint_design.png"} className="object-contain right-0 absolute" /> */}

                            </p>

                            <Link
                                href={"/"}
                                className={`${Lato_Font.className} inline-flex items-center gap-3 w-fit`}
                            >
                                <div className='h-8 w-8 border-2 border-primaryBrown bg-[#ECE5CB] flex items-center justify-center text-primaryBrown '>
                                    <Phone size={16} />
                                </div>
                                <p className="">+2347035963434</p>
                            </Link>
                            <Link
                                href={"/"}
                                className={`${Lato_Font.className} inline-flex items-center gap-3  w-fit`}
                            >
                                <div className='h-8 w-8 border-2 border-primaryBrown bg-[#ECE5CB] flex items-center justify-center text-primaryBrown '>
                                    <Mail size={16} />
                                </div>
                                <p className="">info@theyard.com</p>
                            </Link>
                            <Link
                                href={"/"}
                                className={`${Lato_Font.className} inline-flex items-center gap-3  w-fit`}
                            >
                                <div className='h-8 w-8 border-2 border-primaryBrown bg-[#ECE5CB] flex items-center justify-center text-primaryBrown shrink-0'>
                                    <MapPin size={16} />
                                </div>
                                <p className="">21 Umuawulu Street, Independence Layout, Enugu</p>
                            </Link>


                        </div>

                        <div className='flex flex-col gap-5'>
                            <p className={`${Lato_Font.className} text-primaryBrown text-sm font-light relative w-fit uppercase`}>
                                Social Links
                                {/* <Image width={100} height={100} alt="" src={"/images/paint_design.png"} className="object-contain right-0 absolute" /> */}

                            </p>

                            <Link
                                href={"/"}
                                className={`${Lato_Font.className} inline-flex items-center gap-3 w-fit`}
                            >
                                <div className='h-8 w-8 border-2 border-primaryBrown bg-[#ECE5CB] flex items-center justify-center text-primaryBrown '>
                                    <RiWhatsappLine size={16} />
                                </div>
                                <p className="">Whatsapp</p>
                            </Link>
                            <Link
                                href={"/"}
                                className={`${Lato_Font.className} inline-flex items-center gap-3  w-fit`}
                            >
                                <div className='h-8 w-8 border-2 border-primaryBrown bg-[#ECE5CB] flex items-center justify-center text-primaryBrown '>
                                    <RiInstagramLine size={16} />
                                </div>
                                <p className="">Instagram</p>
                            </Link>

                            <Link
                                href={"/"}
                                className={`${Lato_Font.className} inline-flex items-center gap-3  w-fit`}
                            >
                                <div className='h-8 w-8 border-2 border-primaryBrown bg-[#ECE5CB] flex items-center justify-center text-primaryBrown '>
                                    <RiTiktokLine size={16} />
                                </div>
                                <p className="">Tiktok</p>
                            </Link>
                            <Link
                                href={"/"}
                                className={`${Lato_Font.className} inline-flex items-center gap-3  w-fit`}
                            >
                                <div className='h-8 w-8 border-2 border-primaryBrown bg-[#ECE5CB] flex items-center justify-center text-primaryBrown '>
                                    <SlSocialFacebook size={16} />
                                </div>
                                <p className="">Facebook</p>
                            </Link>

                        </div>



                    </div>

                    <hr />
                    <div className={`flex flex-col md:flex-row md:items-center md:justify-between mt-10 gap-6 ${Lato_Font.className}`}>
                        <Image src={"/images/logo.svg"} width={80} height={80} alt='Logo' className='object-contain' />
                        <div className='flex flex-col  md:justify-center md:items-center text-sm gap-3'>
                            <div className='flex flex-col md:flex-row md:items-center gap-3'>
                                <Link href={"/"} className='underline underline-offset-2 decoration-primaryBrown'>
                                    Terms & Conditions
                                </Link>
                                <Link href={"/"} className='underline underline-offset-2 decoration-primaryBrown'>
                                    Privacy Policy
                                </Link>
                            </div>

                            <p>© 2026 — Copyright The Yard Picnic Park. All rights reserved.</p>
                        </div>
                        <Image src={"/images/developed_by_blueducks.svg"} width={80} height={80} alt='Logo' className='object-contain' />

                    </div>
                </div>

                <Image src={"/images/flower_footer_left.svg"} width={300} height={300} alt='Logo' className='object-contain absolute bottom-0 left-0' />
                <Image src={"/images/flower_footer_right.svg"} width={300} height={300} alt='Logo' className='object-contain absolute bottom-0 right-0' />

            </div>
        </footer>
    )
}
