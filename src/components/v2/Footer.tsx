"use client";
// import { Lato_Font, PlayFair } from '@/app/v2/page';
import { subscribeToNewsletter } from '@/util';
import { Mail, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { RiInstagramLine, RiTiktokLine, RiWhatsappLine } from 'react-icons/ri';
import { SlSocialFacebook } from 'react-icons/sl';
import { toast } from 'react-toastify';


export default function Footer() {
    // const pathname = usePathname();
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubscribe = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isSubmitting) return;

        const first = firstname.trim();
        const last = lastname.trim();
        const mail = email.trim();

        if (!first || !last || !mail) {
            toast.error('Please fill firstname, lastname and email.');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await subscribeToNewsletter({
                firstname: first,
                lastname: last,
                email: mail,
            });

            if (!response?.success) {
                throw new Error(response?.message || 'Unable to subscribe right now.');
            }

            toast.success('You have been subscribed to our newsletter.');
            setFirstname('');
            setLastname('');
            setEmail('');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <footer className={`relative`}>
            <div
                aria-hidden="true"
                className="absolute h-45 w-full left-0 -top-15 -translate-y-1/2 overflow-hidden pointer-events-none"
            >
                <div className="trees-marquee flex h-full w-max">
                    {[0, 1].map((half) => (
                        <div key={half} className="flex h-full shrink-0">
                            {Array.from({ length: 4 }, (_, i) => (
                                <Image
                                    key={i}
                                    src={"/images/trees_design_footer.svg"}
                                    alt=""
                                    width={1000}
                                    height={1000}
                                    className="h-full w-120 max-w-none object-cover shrink-0"
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>


            <div className="bg-primaryGreen p-7  md:p-14  grid  md:gap-5 text-white relative">
                <div className='flex items-center justify-center flex-col'>
                    <h1 className={`text-primaryBrown text-xl font-playfair-display font-medium text`}>
                        Subscribe to our Newsletter
                    </h1>
                    <p className={`font-lato text-sm text-center`}>Join our picnic lovers list for updates,tips, offers, and event inspiration.
                    </p>
                    <form onSubmit={handleSubscribe} className='grid grid-cols-1 md:grid-cols-2 w-full md:w-[60%] mt-10 gap-y-4'>
                        <div className='h-14 border flex items-center p-4'>
                            <input
                                type="text"
                                placeholder='Firstname'
                                value={firstname}
                                onChange={(event) => setFirstname(event.target.value)}
                                className='h-full outline-none bg-transparent w-full'
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className='h-14 border flex items-center p-4'>
                            <input
                                type="text"
                                placeholder='Lastname'
                                value={lastname}
                                onChange={(event) => setLastname(event.target.value)}
                                className='h-full outline-none bg-transparent w-full'
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className='  items-center  md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-y-4'>
                            <div className='h-14 border flex items-center p-4 md:col-span-2'>
                                <input
                                    type="email"
                                    placeholder='Email'
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    className='h-full outline-none bg-transparent w-full'
                                    disabled={isSubmitting}
                                />
                            </div>

                            <button
                                type='submit'
                                disabled={isSubmitting}
                                className='bg-white h-full text-black text-sm py-4 disabled:opacity-70 disabled:cursor-not-allowed'
                            >
                                {isSubmitting ? 'Subscribing...' : 'Accept our policy & Subscribe'}
                            </button>
                        </div>

                    </form>

                </div>

                <div className='pt-10'>
                    <div className='grid grid-cols-1 md:grid-cols-5 gap-5 py-10 text-sm'>

                        <div className='relative flex flex-col gap-5 grid-cols-1 md:col-span-2 md:pr-10'>
                            <h1 className={`font-semibold text-xl  relative font-playfair-display w-fit text-primaryBrown md:text-white`}>Quick Introduction:
                                <Image width={100} height={100} alt="" src={"/images/paint_design.png"} className="object-contain right-0 absolute" />


                            </h1>
                            <p className={`font-lato text-white/50 mt-2 text-sm font-light`}>
                                At The Yard, we believe every moment is worth celebrating. Whether it&apos;s a quiet picnic, a romantic date, or a joyful gathering with friends, our beautiful green spaces and curated setups create memories to cherish forever.
                            </p>

                        </div>

                        <div className='flex flex-col gap-5 text-sm'>
                            <p className={`font-lato text-primaryBrown text-sm font-light relative w-fit uppercase`}>
                                Menus
                                {/* <Image width={100} height={100} alt="" src={"/images/paint_design.png"} className="object-contain right-0 absolute" /> */}

                            </p>

                            <Link href={"/packages"} className={`font-lato`}>
                                Packages
                            </Link>
                            <Link href={"/events"} className={`font-lato`}>
                                Events
                            </Link>
                            <Link href={"/about"} className={`font-lato`}>
                                About
                            </Link>
                            <Link href={"/gallery"} className={`font-lato`}>
                                Gallery
                            </Link>

                        </div>

                        <div className='flex flex-col gap-5 text-sm'>
                            <p className={`font-lato text-primaryBrown text-sm font-light relative w-fit uppercase`}>
                                Contact us
                                {/* <Image width={100} height={100} alt="" src={"/images/paint_design.png"} className="object-contain right-0 absolute" /> */}

                            </p>

                            <a
                                href={"tel:+2349018257388"}
                                target='_blank'
                                className={`font-lato inline-flex items-center gap-3 w-fit`}
                            >
                                <div className='h-8 w-8 border-2 border-primaryBrown bg-[#ECE5CB] flex items-center justify-center text-primaryBrown '>
                                    <Phone size={16} />
                                </div>
                                <p className="">+2349018257388</p>
                            </a>
                            <a
                                href={"mailto:booking@picnicattheyard.com"}
                                target='_blank'

                                className={`font-lato inline-flex items-center gap-3  w-fit`}
                            >
                                <div className='h-8 w-8 border-2 border-primaryBrown bg-[#ECE5CB] flex items-center justify-center text-primaryBrown '>
                                    <Mail size={16} />
                                </div>
                                <p className="">booking@picnicattheyard.com</p>
                            </a>
                            <a
                                href={"https://maps.app.goo.gl/PVs15BWxQiazupRf9"}
                                target='_blank'
                                className={`font-lato inline-flex items-center gap-3  w-fit`}
                            >
                                <div className='h-8 w-8 border-2 border-primaryBrown bg-[#ECE5CB] flex items-center justify-center text-primaryBrown shrink-0'>
                                    <MapPin size={16} />
                                </div>
                                <p className="">21 Umuawulu Street, Independence Layout, Enugu</p>
                            </a>


                        </div>

                        <div className='flex flex-col gap-5 text-sm relative z-10'>
                            <p className={`font-lato text-primaryBrown text-sm font-light relative w-fit uppercase`}>
                                Social Links
                                {/* <Image width={100} height={100} alt="" src={"/images/paint_design.png"} className="object-contain right-0 absolute" /> */}

                            </p>

                            <Link
                                href={"https://wa.me/+2349018257388"}
                                className={`font-lato inline-flex items-center gap-3 w-fit`}
                            >
                                <div className='h-8 w-8 border-2 border-primaryBrown bg-[#ECE5CB] flex items-center justify-center text-primaryBrown '>
                                    <RiWhatsappLine size={16} />
                                </div>
                                <p className="">Whatsapp</p>
                            </Link>
                            <a
                                href={"https://www.instagram.com/theyardenugu/ "}
                                target='_blank'
                                className={`font-lato inline-flex items-center gap-3  w-fit`}
                            >
                                <div className='h-8 w-8 border-2 border-primaryBrown bg-[#ECE5CB] flex items-center justify-center text-primaryBrown '>
                                    <RiInstagramLine size={16} />
                                </div>
                                <p className="">Instagram</p>
                            </a>

                            <a
                                href={"https://www.tiktok.com/@theyard.picnicpark"}
                                target='_blank'

                                className={`font-lato inline-flex items-center gap-3  w-fit`}
                            >
                                <div className='h-8 w-8 border-2 border-primaryBrown bg-[#ECE5CB] flex items-center justify-center text-primaryBrown '>
                                    <RiTiktokLine size={16} />
                                </div>
                                <p className="">Tiktok</p>
                            </a>
                            <a
                                href={"https://www.facebook.com/pages/The%20yard%20picnic%20park,Enugu/507875085748038/about/?ref=page_internal "}
                                target='_blank'

                                className={`font-lato inline-flex items-center gap-3  w-fit`}
                            >
                                <div className='h-8 w-8 border-2 border-primaryBrown bg-[#ECE5CB] flex items-center justify-center text-primaryBrown '>
                                    <SlSocialFacebook size={16} />
                                </div>
                                <p className="">Facebook</p>
                            </a>

                        </div>



                    </div>

                    <hr className='opacity-10' />
                    <div className={`flex flex-col md:flex-row md:items-center md:justify-between mt-10 gap-6 font-lato`}>
                        <Image src={"/images/logo.svg"} width={80} height={80} alt='Logo' className='object-contain' />
                        <div className='flex flex-col  md:justify-center md:items-center text-sm gap-3'>
                            <div className='flex flex-col md:flex-row md:items-center gap-3'>
                                <Link href={"/terms"} className='underline underline-offset-2 decoration-primaryBrown'>
                                    Terms & Conditions
                                </Link>
                                <Link href={"/terms"} className='underline underline-offset-2 decoration-primaryBrown'>
                                    Privacy Policy
                                </Link>
                            </div>

                            <p>© 2026 — Copyright The Yard Picnic Park. All rights reserved.</p>
                        </div>
                        <a href="https://blueducksltd.com/" target='_blank' className='relative z-10'>

                            <Image src={"/images/developed_by_blueducks.svg"} width={80} height={80} alt='Logo' className='object-contain' />
                        </a>

                    </div>
                </div>

                <Image src={"/images/flower_footer_left.svg"} width={300} height={300} alt='Logo' className='object-contain absolute bottom-0 left-0' />
                <Image src={"/images/flower_footer_right.svg"} width={300} height={300} alt='Logo' className='object-contain absolute bottom-0 right-0' />

            </div>
        </footer>
    )
}
