/**
 * v0 by Vercel.
 * @see https://v0.dev/t/SooJkxJIZ63
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link"
import styles from '../styles/landingpage.module.css'
 
export default function Component() {
  return (
<div className={` ${styles.background} flex flex-col min-h-[100dvh] `}>
      <main className={ `${styles.main} flex-1 `}>
        <section className="w-full py-12 sm:py-20 md:py-32 lg:py-40">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_550px]">
              <div className="flex flex-col justify-center space-y-4">
              <div className="" style={{ marginTop: "90px" }}>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none ">
                    Connect with Experts in Real-Time
                  </h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Join our expert-led chat rooms and get instant access to industry insights, best practices, and
                    personalized guidance.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="/user/login"
                    className={` ${styles.btn} inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50`}
                    prefetch={false}
                  >
                  User
                  </Link>
                  <Link 
                    href="/expert/login"
                    className={`${styles.btn} inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50`}
                    prefetch={false}
                  >
                    Expert
                  </Link>
                </div>
              </div>
          
            </div>
          </div>
        </section>
      </main>

    </div>
  )
}

