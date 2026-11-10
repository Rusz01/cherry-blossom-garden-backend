type RiseTextProps = {
    text: string;
    /** Seconds before the first word. */
    delay?: number;
    /** Seconds between words. */
    interval?: number;
    className?: string;
};

/**
 * CSS-only masked word rise for above-the-fold headings.
 * A Server Component: the words are real text in the HTML and the animation
 * starts on first paint, before hydration. Nest inside the heading element;
 * chain several with `delay` to continue a sequence across lines.
 */
export default function RiseText({
                                     text,
                                     delay = 0,
                                     interval = 0.07,
                                     className,
                                 }: RiseTextProps) {
    const words = text.split(" ");

    return (
        <span className={className}>
            {words.map((word, index) => (
                <span key={index}>
                    {/* Padding keeps descenders (Allura, Cormorant) inside the mask. */}
                    <span className="-mb-[0.18em] inline-block overflow-hidden pb-[0.18em] align-top">
                        <span
                            className="cbg-rise inline-block"
                            style={{ animationDelay: `${delay + index * interval}s` }}
                        >
                            {word}
                        </span>
                    </span>
                    {index < words.length - 1 ? " " : null}
                </span>
            ))}
        </span>
    );
}
