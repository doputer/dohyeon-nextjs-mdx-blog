interface StampProps {
  emoji: string;
}

const Stamp = ({ emoji }: StampProps) => {
  return (
    <section className="space-y-8">
      <div aria-hidden className="flex justify-center gap-3 text-accent select-none">
        <span>·</span>
        <span>·</span>
        <span>·</span>
      </div>
      <div
        className="mx-auto flex size-14 -rotate-3 items-center justify-center rounded-lg border-[1.5px] border-accent bg-accent/5 text-2xl select-none"
        title="낙관"
      >
        {emoji}
      </div>
    </section>
  );
};

export default Stamp;
