"use client";

const currentYear = new Date().getFullYear();

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white/90">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-4 py-6 text-xs text-slate-500 sm:px-8 lg:px-12">
        <p className="font-semibold text-slate-700">
          © 2022 - {currentYear} Horizon Simulations Group Limited.
        </p>
        <p>
          Horizon Simulations Group Limited is a company registered in England
          and Wales. Companies House Registration Number: 15714268.
        </p>
        <p>
          Registered address: 3rd Floor, 86-90 Paul Street, London, United
          Kingdom, EC2A 4NE.
        </p>
      </div>
    </footer>
  );
}

