import Image from "next/image";
import Link from "next/link";

type ButtonProps = {
  type?: "button" | "submit";
  title: string;
  icon?: string;
  variant: string;
  full?: boolean;
  href?: string;
  onClick?: () => void;
};

const Button = ({
  type = "button",
  title,
  icon,
  variant,
  full,
  href,
  onClick,
}: ButtonProps) => {
  const className = `flexCenter gap-3 rounded-full border ${variant} ${full ? "w-full" : ""} px-6 py-3`;

  const content = (
    <>
      {icon && (
        <Image src={icon} alt="" width={24} height={24} unoptimized />
      )}
      <span className="bold-16 whitespace-nowrap">{title}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button className={className} type={type} onClick={onClick}>
      {content}
    </button>
  );
};

export default Button;
