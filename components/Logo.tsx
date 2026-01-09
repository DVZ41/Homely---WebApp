export function Logo({ className = "h-12" }: { className?: string }) {
  return (
    <>
      <img 
        src="/logofinalclaro.png" 
        alt="Homely Logo" 
        className={`${className} dark:hidden object-contain`}
      />
      <img 
        src="/logofinaloscuro.png" 
        alt="Homely Logo" 
        className={`${className} hidden dark:block object-contain`}
      />
    </>
  );
}
