import GalleryDetailClient from '@/components/GalleryDetailClient';
import React from 'react'

interface IProps {
    params: Promise<{ title: string }>;
}

const page = async ({ params }: IProps) => {
    const { title } = await params;
    return (
        <GalleryDetailClient title={decodeURIComponent(title)} />
    )
}

export default page