"use client";
import HeaderTextComp from '@/components/v2/HeaderTextComp'
import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link';
import React, { useState } from 'react';
import { RiWhatsappLine } from 'react-icons/ri';
import { motion, useReducedMotion } from 'motion/react';

type FAQ = { question: string; answer: string }

const faqs: FAQ[] = [
    {
        question: "How far in advance do I need to place an order?",
        answer: "We recommend placing your order at least 3-5 business days in advance to ensure availability and proper preparation time for your event."
    },
    {
        question: "Do you offer delivery services?",
        answer: "Yes, we offer delivery within Lagos and surrounding areas. Delivery fees vary based on location and order size, and will be calculated at checkout."
    },
    {
        question: "Can I customize my package?",
        answer: "Absolutely! Most of our packages can be tailored to fit your specific needs. Reach out to our team and we'll work with you to create the perfect setup."
    },
    {
        question: "What is your cancellation policy?",
        answer: "Cancellations made more than 48 hours before your event are eligible for a full refund. Cancellations within 48 hours may incur a cancellation fee."
    },
    {
        question: "Do you cater to large events?",
        answer: "Yes, we handle events of all sizes, from intimate gatherings to large celebrations. Contact us with your guest count and we'll recommend the best package."
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept bank transfers, debit/credit cards, and selected mobile payment options. Full payment details are provided at checkout."
    },
    {
        question: "Can I make changes to my order after booking?",
        answer: "Minor changes can typically be accommodated up to 24 hours before your event, subject to availability. Please contact our support team as soon as possible."
    },
];

export default function Page() {
    const shouldReduceMotion = useReducedMotion();
    const [faqState, setFaqState] = useState<(FAQ & { show: boolean })[]>(
        faqs.map(item => ({ ...item, show: false }))
    );

    const toggleFaq = (index: number) => {
        setFaqState(prev =>
            prev.map((item, i) => ({
                ...item,
                // Clicking an open item closes it; clicking a closed item
                // opens it and closes everything else.
                show: i === index ? !item.show : false,
            }))
        );
    };

    const sectionReveal = {
        hidden: { opacity: 0, y: 18, filter: 'blur(6px)' },
        visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
    };

    const itemReveal = {
        hidden: { opacity: 0, y: 16, filter: 'blur(6px)' },
        visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
    };

    return (
        <div className='pb-20 md:pb-40'>
            <motion.div initial={shouldReduceMotion ? false : 'hidden'} whileInView={shouldReduceMotion ? undefined : 'visible'} viewport={{ once: true, amount: 0.2 }} variants={sectionReveal} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                <HeaderTextComp
                pageName="FAQS"
                subtitleText="Check out questions we feel you might have for us."
                titleText="Frequently asked"
                titleStyledText="Questions"
            />
            </motion.div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-3 px-5 md:px-20 py-10'>
                <div className='relative md:block hidden'>
                    <Image
                        src={"/images/faq.png"}
                        width={400}
                        height={400}
                        alt={"Faq image"}
                        className="object-cover"
                    />
                </div>

                <motion.div className='pl-0 md:pl-20 font-lato text-sm space-y-2' initial={shouldReduceMotion ? false : 'hidden'} whileInView={shouldReduceMotion ? undefined : 'visible'} viewport={{ once: true, amount: 0.2 }} variants={sectionReveal} transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}>
                    {faqState.map((item, index) => (
                        <motion.div
                            key={index}
                            className='border cursor-pointer overflow-hidden'
                            onClick={() => toggleFaq(index)}
                        >
                            <div className='px-3 flex items-center justify-between h-18 shrink-0'>
                                <p>{item.question}</p>
                                <ChevronDown
                                    className={`shrink-0 transition-transform duration-300 ${item.show ? "rotate-180" : "rotate-0"
                                        }`}
                                />
                            </div>

                            {/* Outer: clips content during the height transition */}
                            <div
                                className={`overflow-hidden transition-[height] duration-300 ease-in-out ${item.show ? "h-auto" : "h-0"
                                    }`}
                                style={{
                                    // grid-rows trick gives a real animatable height
                                    // even though content height is dynamic/unknown.
                                    display: "grid",
                                    gridTemplateRows: item.show ? "1fr" : "0fr",
                                    transition: "grid-template-rows 300ms ease-in-out",
                                }}
                            >
                                <div className="overflow-hidden">
                                    <p className="px-3 pb-6 text-[#717068]">{item.answer}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            <motion.div className='py-20 flex flex-col justify-center items-center gap-4' initial={shouldReduceMotion ? false : 'hidden'} whileInView={shouldReduceMotion ? undefined : 'visible'} viewport={{ once: true, amount: 0.2 }} variants={sectionReveal} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                <p className='text-primaryGreen font-lato'>COULD NOT FIND YOUR QUESTION?</p>
                <Link href={"/"} className='px-9 py-3 bg-primaryGreen text-white w-fit flex gap-3 items-center font-lato text-sm'>Send us a whatsapp <RiWhatsappLine  size={18}/></Link>
            </motion.div>
        </div>
    )
}