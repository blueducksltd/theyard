import HeaderTextComp from '@/components/v2/HeaderTextComp'
import Image from 'next/image'
import React from 'react'

interface TermsSubsection {
    number: string
    title: string
    intro?: string
    list?: string[]
    paragraph?: string
}

interface TermsSectionData {
    number: string
    title: string
    subsections: TermsSubsection[]
}

// All terms content lives here as data. To add/edit a section, just edit this array —
// no JSX duplication needed.
const TERMS_SECTIONS: TermsSectionData[] = [
    {
        number: '1',
        title: 'Reservations & Bookings',
        subsections: [
            {
                number: '1.1',
                title: 'To secure a reservation:',
                intro: '',
                list: [
                    'Complete the booking process through our website, social media channels, or authorized representatives.',
                    'Provide accurate information.',
                    ' A confirmation message or receipt has been issued by The Yard. All bookings are subject to availability and may be declined at our discretion where capacity or operational limitations exist. All bookings are subject to availability and may be declined at our discretion where capacity or operational limitations exist. All bookings are subject to availability and may be declined at our discretion where capacity or operational limitations exist. All bookings are subject to availability and may be declined at our discretion where capacity or operational limitations exist.',
                ],
            },
            {
                number: '1.2',
                title: 'Booking Confirmation:',
                intro: 'A booking is only considered confirmed when:',
                list: [
                    'Payment has been received and verified.',
                    ' A confirmation message or receipt has been issued by The Yard. All bookings are subject to availability and may be declined at our discretion where capacity or operational limitations exist. All bookings are subject to availability and may be declined at our discretion where capacity or operational limitations exist. All bookings are subject to availability and may be declined at our discretion where capacity or operational limitations exist. All bookings are subject to availability and may be declined at our discretion where capacity or operational limitations exist.',
                ],
            },
            {
                number: '1.3',
                title: 'Availability:',
                paragraph:
                    'All bookings are subject to availability and may be declined at our discretion where capacity or operational limitations exist.',
            },
        ],
    },
    {
        number: '2',
        title: 'Payments',
        subsections: [
            {
                number: '2.1',
                title: 'To secure a reservation:',
                intro: '',
                list: [
                    'Complete the booking process through our website, social media channels, or authorized representatives.',
                    'Provide accurate information.',
                    'A confirmation message or receipt has been issued by The Yard.',
                ],
            },
            {
                number: '2.2',
                title: 'Booking Confirmation:',
                intro: 'A booking is only considered confirmed when:',
                list: [
                    'Payment has been received and verified.',
                    'A confirmation message or receipt has been issued by The Yard.',
                ],
            },
            {
                number: '2.3',
                title: 'Availability:',
                paragraph:
                    'All bookings are subject to availability and may be declined at our discretion where capacity or operational limitations exist.',
            },
        ],
    },
]

function TermsSection({ section }: { section: TermsSectionData }) {
    return (
        <div>
            <div className='flex items-end gap-2 sm:gap-3 pl-1 sm:pl-2'>
                <span className='font-semibold font-playfair-display text-base sm:text-lg'>
                    {section.number}.
                </span>
                <h1 className='text-lg sm:text-xl md:text-2xl font-semibold text-black font-playfair-display'>
                    {section.title}
                </h1>
            </div>

            {section.subsections.map((sub) => (
                <div key={sub.number}>
                    <div className='flex items-center gap-2 sm:gap-3 my-4 sm:my-6'>
                        <span className='font-medium font-playfair-display text-xs sm:text-sm'>
                            {sub.number}
                        </span>
                        <h1 className='text-base sm:text-lg font-medium text-black font-playfair-display'>
                            {sub.title}
                        </h1>
                    </div>

                    {sub.intro && (
                        <p className='font-lato text-sm my-3 sm:my-5'>{sub.intro}</p>
                    )}

                    {sub.list && (
                        <ul className='list-disc font-lato text-sm space-y-3 sm:space-y-6 pl-4 sm:pl-6'>
                            {sub.list.map((item, i: number) => (
                                <li key={i} className='leading-relaxed'>{item}</li>
                            ))}
                        </ul>
                    )}

                    {sub.paragraph && (
                        <p className='font-lato text-sm my-5 sm:my-10 leading-relaxed'>{sub.paragraph}</p>
                    )}
                </div>
            ))}
        </div>
    )
}

export default function Page() {
    return (
        <div className='relatve'>
            <HeaderTextComp
                pageName=''
                subtitleText='Go through our terms of service, so a better client business relationship is established.'
                titleText='Terms of '
                titleStyledText='Service'
            />

            <div className='px-4 sm:px-6 md:px-10 py-4 sm:py-5 space-y-10 sm:space-y-14 max-w-screen-lg mx-auto '>
                {TERMS_SECTIONS.map((section, index) => (
                    <div key={section.number} >
                        <Image
                            className={`absolute hidden md:block ${index % 2 !== 0 ? 'left-0' : 'right-0'}`}
                            src={`/images/${index % 2 !== 0 ? 'floral.png' : 'Floral-right.png'}`}
                            alt=''
                            width={300}
                            height={300}
                        />

                        <TermsSection section={section} />
                    </div>
                ))}
            </div>
        </div>
    )
}