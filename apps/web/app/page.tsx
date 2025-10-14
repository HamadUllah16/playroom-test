import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={`${styles.page} flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-neutral-900`}>
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white">
        LANDING PAGE GOES HERE
      </h1>

      <div className="flex gap-6 mt-6">
        <Link href="/docs">
          <button className="px-6 py-3 rounded-xl bg-amber-100 text-black hover:bg-amber-300 shadow-md transition">
            Documentation
          </button>
        </Link>
      </div>
    </main>
  );
}
