import Image from "next/image";
import ScrambleText from "@/components/ScrambleText";

const ABOUT_DETAILS = [
  "Bachelor's in Computer Science",
  "4 years of coding experience",
  "Web development certification",
  "2 years of freelance experience",
];

const EXPERIENCE = [
  {
    role: "Role title",
    org: "Company / project",
    period: "20XX — Present",
    description: "One line on what you did and the impact it had.",
  },
  {
    role: "Role title",
    org: "Company / project",
    period: "20XX — 20XX",
    description: "One line on what you did and the impact it had.",
  },
  {
    role: "Role title",
    org: "Company / project",
    period: "20XX — 20XX",
    description: "One line on what you did and the impact it had.",
  },
];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <section
        id="home"
        className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
      >
        <h1 className="font-humane text-[clamp(4rem,24vw,30rem)] leading-none font-medium uppercase tracking-normal text-white">
          <ScrambleText text="mujtaba" />
        </h1>
      </section>

      <section
        id="about"
        className="flex min-h-screen flex-col lg:flex-row"
      >
        <div className="relative flex h-[55vh] shrink-0 items-end justify-center lg:h-auto lg:w-[42%] lg:items-end lg:justify-end lg:pl-8">
          <div className="about-photo-fade relative h-full w-full max-w-md lg:max-w-none">
            <Image
              src="/assets/about-photo-cutout.png"
              alt="Portrait of Mujtaba"
              width={453}
              height={800}
              sizes="(min-width: 1024px) 42vw, 90vw"
              className="h-full w-full object-contain object-bottom lg:object-[center_bottom]"
              priority
            />
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-center px-6 py-16 text-center sm:px-12 lg:px-16 lg:text-left xl:px-20">
          <h2 className="font-humane text-[4rem] uppercase leading-none tracking-normal text-zinc-900 sm:text-[6rem] lg:text-[7rem] xl:text-[8rem]">
            About
          </h2>
          <ul className="mt-10 flex flex-col border-t border-zinc-900/10 lg:mt-14">
            {ABOUT_DETAILS.map((detail, index) => (
              <li
                key={detail}
                className="flex items-baseline justify-center gap-8 border-b border-zinc-900/10 py-7 lg:justify-start"
              >
                <span className="font-mono text-sm text-zinc-900/35">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-2xl text-zinc-900/80">{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="projects"
        className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
      >
        <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
          Projects
        </h2>
        <p className="mt-4 max-w-md text-zinc-900/70">
          Project cards go here.
        </p>
      </section>

      <section
        id="experience"
        className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
      >
        <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
          Experience
        </h2>
        <div className="mt-8 flex w-full max-w-lg flex-col gap-6 text-left">
          {EXPERIENCE.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl border border-black/10 bg-black/5 p-5 backdrop-blur-md"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <h3 className="font-medium text-zinc-900">{item.role}</h3>
                <span className="text-sm text-zinc-900/60">{item.period}</span>
              </div>
              <p className="mt-1 text-sm text-zinc-900/60">{item.org}</p>
              <p className="mt-2 text-sm text-zinc-900/70">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="contact"
        className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
      >
        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Contact
        </h2>
        <p className="mt-4 max-w-md text-white/70">
          Contact form / links go here.
        </p>
      </section>
    </main>
  );
}
