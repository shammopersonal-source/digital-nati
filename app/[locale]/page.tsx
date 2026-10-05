import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { ButtonLink, TextLink } from "@/components/Button";
import CourseList from "@/components/CourseList";
import { LaptopWithCha, PhoneMessage } from "@/components/illustrations/Drawings";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Home />;
}

function Home() {
  const t = useTranslations("home");
  const steps = [1, 2, 3] as const;

  return (
    <>
      <section className="mx-auto grid max-w-page items-center gap-10 px-5 pb-14 pt-10 md:grid-cols-[3fr_2fr]">
        <div>
          <h1 className="max-w-[18ch]">{t("title")}</h1>
          <p className="mt-5 text-lg">{t("intro")}</p>
          <p className="mt-3 text-ink-soft">{t("nameMeaning")}</p>
          <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6">
            <ButtonLink href="/signup" className="text-xl">
              {t("start")}
            </ButtonLink>
            <TextLink href="/login">{t("login")}</TextLink>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-sm text-ink">
          <LaptopWithCha className="w-full" />
          <p className="absolute -bottom-6 left-2 -rotate-3 font-hand text-xl text-green-dark">
            {t("marginNote")}
          </p>
        </div>
      </section>

      <section aria-labelledby="how" className="border-y-2 border-ink bg-white">
        <div className="mx-auto max-w-page px-5 py-12">
          <h2 id="how">{t("howTitle")}</h2>
          <ol className="mt-6">
            {steps.map((n) => (
              <li key={n} className="grid max-w-none grid-cols-[3rem_1fr] gap-4 border-b border-line-soft py-5 last:border-b-0 sm:grid-cols-[4rem_1fr]">
                <span aria-hidden="true" className="font-heading text-3xl leading-none text-green">
                  {n}.
                </span>
                <div>
                  <h3>{t(`how${n}Title`)}</h3>
                  <p className="mt-1">{t(`how${n}Text`)}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="learn" className="mx-auto max-w-page px-5 py-12">
        <h2 id="learn">{t("learnTitle")}</h2>
        <p className="mt-2">{t("learnIntro")}</p>
        <div className="mt-6">
          <CourseList compact />
        </div>
        <TextLink href="/courses" className="mt-4">
          {t("allCourses")}
        </TextLink>
      </section>

      <section aria-labelledby="families" className="mx-auto max-w-page px-5 pb-12">
        <div className="grid items-center gap-6 rounded-md border-2 border-ink bg-green-wash p-6 sm:grid-cols-[8rem_1fr] sm:p-8">
          <PhoneMessage className="mx-auto w-24 text-ink sm:w-32" />
          <div>
            <h2 id="families">{t("familiesTitle")}</h2>
            <p className="mt-2">{t("familiesText")}</p>
            <TextLink href="/families" className="mt-2">
              {t("familiesLink")}
            </TextLink>
          </div>
        </div>
      </section>

      <section aria-labelledby="why" className="mx-auto max-w-page px-5 pb-6">
        <h2 id="why">{t("whyTitle")}</h2>
        <div className="mt-4 space-y-4 border-l-4 border-marigold pl-5">
          <p>{t("why1")}</p>
          <p>{t("why2")}</p>
          <p className="font-bold">{t("why3")}</p>
        </div>
        {/*
          Real learner quotes go here once we have them (with permission).
          Do not add made-up testimonials. Example:

          <section aria-labelledby="voices" className="mt-12">
            <h2 id="voices">In their own words</h2>
            <figure className="mt-4 border-l-4 border-green pl-5">
              <blockquote className="text-lg">“…”</blockquote>
              <figcaption className="mt-2 text-ink-soft">— Name, age, town</figcaption>
            </figure>
          </section>
        */}
      </section>
    </>
  );
}
