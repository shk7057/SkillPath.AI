import Link from "next/link";
import { Footer } from "@/components/landing/footer";
import { FeatureCard } from "@/components/landing/feature-card";
import { FooterCta } from "@/components/landing/footer-cta";
import {
  CareerRoadmapIcon,
  MockInterviewIcon,
  ResumeCheckerIcon,
  SkillMatchIcon
} from "@/components/landing/icons";
import { Navbar } from "@/components/landing/navbar";
import { SectionHeading } from "@/components/landing/section-heading";
import { StepCard } from "@/components/landing/step-card";
import { TestimonialCard } from "@/components/landing/testimonial-card";

const features = [
  {
    title: "Skill Match",
    description:
      "See how your current strengths map to real job roles and discover the exact skills to level up next.",
    icon: <SkillMatchIcon />,
    accent: "from-sky/80 to-white",
    href: "/dashboard/skill-match"
  },
  {
    title: "Resume ATS Checker",
    description:
      "Get clear, recruiter-friendly feedback on keywords, formatting, and impact before you apply.",
    icon: <ResumeCheckerIcon />,
    accent: "from-lavender/90 to-white",
    href: "/dashboard/resume-checker"
  },
  {
    title: "Oral Mock Interview",
    description:
      "Practice common interview questions, improve fluency, and build confidence with guided feedback.",
    icon: <MockInterviewIcon />,
    accent: "from-sky/70 to-lavender/55",
    href: "/dashboard/interview-ai"
  },
  {
    title: "Career Roadmap",
    description:
      "Follow a structured plan tailored to your target role, with milestones that keep progress focused.",
    icon: <CareerRoadmapIcon />,
    accent: "from-white to-sky/65",
    href: "/dashboard"
  }
];

const steps = [
  {
    step: "01",
    title: "Tell us your goal",
    description:
      "Pick the role you want, your current experience level, and what you want help with first."
  },
  {
    step: "02",
    title: "Get a personalized plan",
    description:
      "SkillPath.AI turns your profile into a clean roadmap for skills, resume improvements, and interview prep."
  },
  {
    step: "03",
    title: "Practice and improve",
    description:
      "Track progress week by week with focused exercises that keep you moving toward job readiness."
  }
];

const testimonials = [
  {
    quote:
      "The roadmap gave me clarity on what to study first. I stopped jumping between random tutorials and started applying with confidence.",
    name: "Ananya S.",
    role: "Final-year Computer Science student"
  },
  {
    quote:
      "The ATS feedback was practical and easy to fix. My resume finally sounded sharper and more aligned with the roles I wanted.",
    name: "Rahul P.",
    role: "Fresher preparing for product analyst roles"
  },
  {
    quote:
      "Mock interviews helped me slow down, structure my answers, and feel less nervous before placement season.",
    name: "Megha K.",
    role: "Campus placement candidate"
  }
];

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 -z-10 h-[38rem] bg-hero-radial opacity-90" />

      <Navbar />

      <section className="page-wrap pb-16 pt-8">
        <div className="page-max grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full border border-white/70 bg-white/75 px-4 py-2 text-sm font-medium text-slate-600 shadow-soft backdrop-blur">
              Built for students and freshers starting their career journey
            </span>

            <h1 className="mt-6 max-w-3xl font-display text-4xl leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Your AI Career Coach for Jobs, Skills &amp; Interviews
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              SkillPath.AI helps you understand where you stand, what to learn
              next, and how to prepare for real hiring conversations without
              feeling overwhelmed.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/signup" className="btn-primary rounded-full px-6 py-3.5">
                Start Free
              </Link>
              <Link href="/dashboard" className="btn-secondary rounded-full px-6 py-3.5">
                Try Demo
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="metric-tile rounded-3xl">
                <p className="text-2xl font-semibold text-slate-900">4 core tools</p>
                <p className="mt-1 text-sm text-slate-500">
                  One focused workflow for job readiness
                </p>
              </div>
              <div className="metric-tile rounded-3xl">
                <p className="text-2xl font-semibold text-slate-900">Personalized</p>
                <p className="mt-1 text-sm text-slate-500">
                  Guidance shaped around your target role
                </p>
              </div>
              <div className="metric-tile rounded-3xl">
                <p className="text-2xl font-semibold text-slate-900">Calm UI</p>
                <p className="mt-1 text-sm text-slate-500">
                  Clear steps instead of noisy dashboards
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 top-8 hidden h-24 w-24 rounded-full bg-lavender/70 blur-3xl sm:block" />
            <div className="absolute -right-2 bottom-10 hidden h-28 w-28 rounded-full bg-sky/75 blur-3xl sm:block" />

            <div className="surface-panel-strong relative p-5 sm:p-6">
              <div className="panel-dark p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-white/70">Career snapshot</p>
                    <h2 className="mt-2 text-2xl font-semibold">
                      Frontend Developer
                    </h2>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
                    Week 3
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="rounded-3xl bg-white/10 p-4">
                    <div className="flex items-center justify-between text-sm text-white/75">
                      <span>Resume ATS score</span>
                      <span>84/100</span>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-white/10">
                      <div className="h-2 w-[84%] rounded-full bg-gradient-to-r from-sky to-lilac" />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-3xl bg-white/10 p-4">
                      <p className="text-sm text-white/70">Today&apos;s focus</p>
                      <p className="mt-2 text-base font-semibold">
                        React projects
                      </p>
                      <p className="mt-2 text-sm text-white/75">
                        Build one polished case study project this week.
                      </p>
                    </div>
                    <div className="rounded-3xl bg-white/10 p-4">
                      <p className="text-sm text-white/70">Interview prep</p>
                      <p className="mt-2 text-base font-semibold">
                        Oral mock session
                      </p>
                      <p className="mt-2 text-sm text-white/75">
                        Practice concise answers for projects and teamwork.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-line bg-mist p-4">
                  <p className="text-sm font-medium text-slate-500">
                    Skills matched
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">
                    78%
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    Clear next step: strengthen TypeScript and system design
                    basics.
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-line bg-white p-4">
                  <p className="text-sm font-medium text-slate-500">
                    Roadmap progress
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">
                    6 milestones
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    Structured plan across resume, projects, and mock interviews.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="page-wrap py-16">
        <div className="page-max">
          <SectionHeading
            eyebrow="Features"
            title="Everything you need to feel prepared for applications"
            description="A focused toolkit for discovering strengths, improving your profile, and showing up more confidently in interviews."
          />

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="page-wrap py-16">
        <div className="page-max grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="surface-panel p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
              About SkillPath.AI
            </p>
            <h2 className="mt-4 font-display text-3xl text-slate-900 sm:text-4xl">
              A gentler path from learning to landing your first role
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              SkillPath.AI is designed for students and freshers who want
              practical guidance without the confusion of piecing together
              advice from dozens of disconnected tools.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[2rem] border border-line bg-mist p-6 shadow-card">
              <p className="text-lg font-semibold text-slate-900">
                Structured, not overwhelming
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Focus on the next best action instead of tracking ten different
                dashboards.
              </p>
            </div>
            <div className="rounded-[2rem] border border-line bg-white p-6 shadow-card">
              <p className="text-lg font-semibold text-slate-900">
                Built for early careers
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                The language, workflows, and feedback stay approachable for
                people entering the job market.
              </p>
            </div>
            <div className="rounded-[2rem] border border-line bg-white p-6 shadow-card">
              <p className="text-lg font-semibold text-slate-900">
                Premium feel, simple flow
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Calm colors, clean hierarchy, and spacious layouts keep the
                experience focused and reassuring.
              </p>
            </div>
            <div className="rounded-[2rem] border border-line bg-lavender/45 p-6 shadow-card">
              <p className="text-lg font-semibold text-slate-900">
                Ready for a full product later
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                This landing page is structured so future onboarding, auth, and
                dashboards can plug in cleanly.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="page-wrap py-16">
        <div className="page-max">
          <SectionHeading
            eyebrow="How It Works"
            title="Three simple steps from uncertainty to clarity"
            description="The experience is designed to keep momentum high and the process easy to understand."
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {steps.map((item) => (
              <StepCard key={item.step} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section className="page-wrap py-16">
        <div className="page-max surface-panel-strong rounded-[2.5rem] p-8 sm:p-10">
          <SectionHeading
            eyebrow="Student Voices"
            title="Support that feels practical, personal, and encouraging"
            description="A testimonial-style section to show how SkillPath.AI can resonate with learners who need direction."
            centered
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.name} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      <FooterCta />
      <Footer />
    </main>
  );
}
