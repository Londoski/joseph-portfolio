import { prisma } from "@/lib/prisma";
import { ContactForm } from "@/components/public/ContactForm";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await prisma.siteSettings.findFirst();
  const whatsapp = settings?.whatsappNumber?.replace(/\D/g, "");

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12 md:py-20">
      <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
        Contact
      </p>
      <h1 className="text-5xl md:text-7xl font-bold text-base leading-[0.95] mb-6">
        Let&apos;s Talk
      </h1>
      <p className="text-muted max-w-2xl mb-16">
        Tell me about your project and I&apos;ll get back to you.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3">
          <ContactForm />
        </div>

        <aside className="lg:col-span-2 space-y-6">
          {settings?.contactEmail && (
            <div>
              <p className="text-xs uppercase tracking-widest text-muted mb-2">
                Email
              </p>
              <a
                href={`mailto:${settings.contactEmail}`}
                className="text-base hover:text-primary"
              >
                {settings.contactEmail}
              </a>
            </div>
          )}
          {whatsapp && (
            <div>
              <p className="text-xs uppercase tracking-widest text-muted mb-2">
                WhatsApp
              </p>
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-block bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-full"
              >
                WhatsApp Me
              </a>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
