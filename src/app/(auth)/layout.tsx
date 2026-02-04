import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-warm-50 via-white to-teal-50 px-4 py-8">
      {/* Logo / Brand */}
      <div className="mb-8 flex flex-col items-center gap-2">
        <Image
          src="/logo.png"
          alt="Joana Savi"
          width={56}
          height={56}
          className="rounded-full shadow-lg"
        />
        <h1 className="text-2xl font-semibold text-teal-800">
          Joana Savi
        </h1>
        <p className="text-sm text-muted-foreground">
          Radiestesia Terapêutica
        </p>
      </div>

      {/* Content */}
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
