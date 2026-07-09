

export default function HeaderTextComp({pageName ,titleText, titleStyledText, subtitleText}: {pageName: string, titleText: string; titleStyledText: string; subtitleText: string;}) {
    return (
        <div className=' flex flex-col justify-center items-center gap-6 pt-35 py-20 '>
            <p className={`font-lato text-primaryGreen`}>{pageName}</p>
            <div className="w-full md:w-[40%] grid gap-4">
                <h1 className={`text-primaryGreen text-4xl font-playfair text-center`}>
                    {titleText} {" "}
                    <span className={`font-petit text-primaryBrown`}>
                        {titleStyledText}
                    </span>
                </h1>
                <p className={`font-inter text-center text-sm`}>{subtitleText}</p>

            </div>

        </div>
    )
}
