import Link from "next/link";

const roles = [
  {
    title: "Admin",
    href: "/register/admin",
    icon: "🛡️",
    border: "border-red-200",
    bg: "bg-red-50",
    text: "text-red-700",
  },

  {
    title: "Seller",
    href: "/register/seller",
    icon: "🏪",
    border: "border-green-200",
    bg: "bg-green-50",
    text: "text-green-700",
  },
  {
    title: "Rider",
    href: "/register/rider",
    icon: "🏍️",
    border: "border-yellow-200",
    bg: "bg-yellow-50",
    text: "text-yellow-700",
  },
  {
    title: "Customer",
    href: "/register/customer",
    icon: "🛒",
    border: "border-blue-200",
    bg: "bg-blue-50",
    text: "text-blue-700",
  },
];

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-6 py-12 text-slate-900">
      <section className="mx-auto grid min-h-[85vh] max-w-7xl items-center gap-10 lg:grid-cols-2">
        {/* Left Section */}
        <div className="max-w-xl">
          <span className="inline-flex rounded-full border border-blue-100 bg-white px-4 py-1 text-sm font-medium text-blue-700 shadow-sm">
            Create Your NexCart Account
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-slate-900 md:text-5xl">
            Start your journey with the right account type.
          </h1>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900">4</h3>
              <p className="mt-1 text-sm text-slate-500">Account Roles</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900">Fast</h3>
              <p className="mt-1 text-sm text-slate-500">Registration</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900">Secure</h3>
              <p className="mt-1 text-sm text-slate-500">Account Setup</p>
            </div>
          </div>

          <p className="mt-8 text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-blue-700 hover:underline"
            >
              Login here
            </Link>
          </p>
        </div>

        {/* Right Section */}
        <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 text-slate-900 shadow-2xl shadow-slate-200/70 backdrop-blur-md md:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Choose registration role
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Pick the role that matches your activity on NexCart.
            </p>
          </div>

          <div className="grid gap-4">
            {roles.map((role) => (
              <Link
                key={role.title}
                href={role.href}
                className={`group flex items-center gap-4 rounded-2xl border ${role.border} ${role.bg} p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                  {role.icon}
                </div>

                <div className="flex-1">
                  <h3 className={`text-lg font-bold ${role.text}`}>
                    {role.title}
                  </h3>
                </div>

                <span className="text-xl text-slate-400 transition group-hover:translate-x-1 group-hover:text-slate-900">
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
