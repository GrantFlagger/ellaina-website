"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Package, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { mockOrders, getOrderStatusLabel } from "@/lib/orders";

type SectionId = "account" | "orders";

const sections: { id: SectionId; icon: typeof User; label: { el: string; en: string } }[] = [
  { id: "account", icon: User, label: { el: "Στοιχεία Λογαριασμού", en: "Account Details" } },
  { id: "orders", icon: Package, label: { el: "Παραγγελίες", en: "Orders" } },
];

export default function Profile() {
  const { user, isAuthenticated, isLoading, logout, updateUser } = useAuth();
  const { lang } = useLanguage();
  const router = useRouter();
  const l = (lang as "el" | "en") ?? "el";

  const [activeSection, setActiveSection] = useState<SectionId>("account");
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
  });

  const sectionRefs = useRef<Record<SectionId, HTMLElement | null>>({
    account: null,
    orders: null,
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name, email: user.email, phone: user.phone ?? "" });
    }
  }, [user]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id as SectionId);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );

    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: SectionId) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSave = () => {
    updateUser({ name: form.name, phone: form.phone });
    setIsEditing(false);
  };

  if (isLoading || !user) return null;

  return (
    <div className="min-h-screen bg-cream dark:bg-night">
      <div className="mx-auto max-w-5xl px-6 pb-32 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 flex items-center gap-5"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 dark:bg-secondary/10">
            <span className="font-heading text-2xl text-primary dark:text-secondary">
              {user.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="font-heading text-3xl text-primary dark:text-cream">{user.name}</h1>
            <p className="font-body text-sm text-bark/60 dark:text-cream/60">{user.email}</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-[220px_1fr]">
          <nav className="hidden md:block">
            <div className="sticky top-32 space-y-1">
              {sections.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 font-body text-sm transition-colors ${
                    activeSection === id
                      ? "bg-primary/10 text-primary dark:bg-secondary/10 dark:text-secondary"
                      : "text-bark/60 hover:bg-primary/5 dark:text-cream/60 dark:hover:bg-secondary/5"
                  }`}
                >
                  <Icon size={16} />
                  {label[l]}
                </button>
              ))}
              <button
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                className="mt-4 flex w-full items-center gap-3 rounded-lg px-4 py-3 font-body text-sm text-bark/40 transition-colors hover:text-secondary dark:text-cream/40"
              >
                <LogOut size={16} />
                {l === "el" ? "Αποσύνδεση" : "Log out"}
              </button>
            </div>
          </nav>

          <div className="space-y-24">
            {/* Account */}
            <section
              id="account"
              ref={(el) => {
                sectionRefs.current.account = el;
              }}
              className="scroll-mt-32"
            >
              <div className="mb-8 flex items-center justify-between">
                <h2 className="font-heading text-2xl text-primary dark:text-cream">
                  {sections[0].label[l]}
                </h2>
                <button
                  onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                  className="font-body text-sm text-secondary hover:underline"
                >
                  {isEditing ? (l === "el" ? "Αποθήκευση" : "Save") : l === "el" ? "Επεξεργασία" : "Edit"}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div>
                  <label className="mb-2 block font-body text-xs uppercase tracking-wide text-bark/50 dark:text-cream/40">
                    {l === "el" ? "Όνομα" : "Name"}
                  </label>
                  {isEditing ? (
                    <input
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      className="w-full border-b border-primary/30 bg-transparent py-2 font-body text-primary outline-none focus:border-secondary dark:border-secondary/30 dark:text-cream"
                    />
                  ) : (
                    <p className="py-2 font-body text-primary dark:text-cream">{form.name || "—"}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block font-body text-xs uppercase tracking-wide text-bark/50 dark:text-cream/40">
                    Email
                  </label>
                  {/* email δεν είναι editable — είναι το κλειδί σύνδεσης */}
                  <p className="py-2 font-body text-primary dark:text-cream">{form.email}</p>
                </div>

                <div>
                  <label className="mb-2 block font-body text-xs uppercase tracking-wide text-bark/50 dark:text-cream/40">
                    {l === "el" ? "Τηλέφωνο" : "Phone"}
                  </label>
                  {isEditing ? (
                    <input
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      className="w-full border-b border-primary/30 bg-transparent py-2 font-body text-primary outline-none focus:border-secondary dark:border-secondary/30 dark:text-cream"
                    />
                  ) : (
                    <p className="py-2 font-body text-primary dark:text-cream">{form.phone || "—"}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Orders */}
            <section
              id="orders"
              ref={(el) => {
                sectionRefs.current.orders = el;
              }}
              className="scroll-mt-32 border-t border-primary/10 pt-16 dark:border-secondary/10"
            >
              <h2 className="mb-8 font-heading text-2xl text-primary dark:text-cream">
                {sections[1].label[l]}
              </h2>

              {mockOrders.length === 0 ? (
                <p className="font-body text-bark/60 dark:text-cream/60">
                  {l === "el" ? "Δεν υπάρχουν παραγγελίες ακόμα." : "No orders yet."}
                </p>
              ) : (
                <div className="space-y-4">
                  {mockOrders.map((order) => (
                    <div key={order.id} className="rounded-xl border border-primary/10 p-6 dark:border-secondary/10">
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <p className="font-heading text-lg text-primary dark:text-cream">{order.id}</p>
                          <p className="font-body text-xs text-bark/50 dark:text-cream/40">
                            {new Date(order.date).toLocaleDateString(l === "el" ? "el-GR" : "en-GB")}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="mb-1 inline-block rounded-full bg-primary/10 px-3 py-1 font-body text-xs text-primary dark:bg-secondary/10 dark:text-secondary">
                            {getOrderStatusLabel(order.status, l)}
                          </span>
                          <p className="font-body text-sm text-primary dark:text-cream">{order.total.toFixed(2)}€</p>
                        </div>
                      </div>

                      <div className="space-y-2 border-t border-primary/5 pt-4 dark:border-secondary/5">
                        {order.items.map((item) => (
                          <div key={item.productId} className="flex items-center gap-4">
                            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-primary/5">
                              <Image src={item.image} alt={item.name[l]} fill className="object-cover" />
                            </div>
                            <p className="flex-1 font-body text-sm text-bark/70 dark:text-cream/70">
                              {item.name[l]} × {item.quantity}
                            </p>
                            <p className="font-body text-sm text-primary dark:text-cream">
                              {(item.price * item.quantity).toFixed(2)}€
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}