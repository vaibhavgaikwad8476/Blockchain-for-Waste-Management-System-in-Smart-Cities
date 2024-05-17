import { Button, buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className="flex h-screen bg-slate-100">
      <section className="flex-grow ">
        <div className="pt-48 ps-20">
          <h1 className="text-emerald-500 font-bold text-7xl">REDUCE</h1>
          <h1 className="text-emerald-500 font-extrabold text-9xl ms-1">
            RECYCLE
          </h1>
          <h1 className="text-emerald-500 font-bold text-7xl">REUSE</h1>
          <h2 className="mt-3">
            Towards a Sustainable Future: Embracing the 3Rs in Everyday Life
          </h2>
          <div className="mt-5">
            <Link
              className={
                buttonVariants({ variant: "outline", size: "lg" }) +
                " rounded-full"
              }
              href={"/register"}
            >
              Register
            </Link>
            <Link
              className={
                buttonVariants({ variant: "default", size: "lg" }) +
                " rounded-full ms-3"
              }
              href={"/login"}
            >
              Login
            </Link>
          </div>
        </div>
      </section>
      <section className="flex-grow text-center">
        <Image
          src={"/home/hero.svg"}
          alt="hero image"
          className="mx-auto bounce-slow"
          width={800}
          height={24}
          priority
        />
      </section>
    </main>
  );
}
