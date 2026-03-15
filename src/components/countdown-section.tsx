import CountdownTimer from './countdown-timer';

export default function CountdownSection() {
    const promotionEndDate = new Date();
    promotionEndDate.setHours(promotionEndDate.getHours() + 72);

    return (
        <section className="py-12 md:py-16 bg-secondary text-primary-foreground">
            <div className="container mx-auto flex flex-col items-center justify-center text-center px-4 md:px-6">
                <h2 className="font-headline text-2xl md:text-3xl font-bold text-accent animate-pulse" style={{ textShadow: '0 0 10px hsl(var(--accent))' }}>
                    ⚡ Aproveite! Descontos encerram em breve!
                </h2>
                <div className="mt-6 w-full max-w-lg">
                    <CountdownTimer endDate={promotionEndDate.toISOString()} />
                </div>
            </div>
        </section>
    );
}
