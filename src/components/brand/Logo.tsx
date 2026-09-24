import Image from "next/image";

const files = {
  onDark: "/brand/logo-on-dark.png",
  onLight: "/brand/logo.png",
} as const;

const sizes = {
  header: "h-[3.75rem] w-auto sm:h-16",
  footer: "h-[6.5rem] w-auto",
} as const;

export function Logo({
  tone = "onDark",
  size = "header",
  className = "",
}: {
  tone?: keyof typeof files;
  size?: keyof typeof sizes;
  className?: string;
}) {
  return (
    <Image
      src={files[tone]}
      alt=""
      width={660}
      height={579}
      priority
      unoptimized
      className={`${sizes[size]} ${className}`}
    />
  );
}
