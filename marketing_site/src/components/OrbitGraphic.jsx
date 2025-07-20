import React, { useEffect, useState } from "react";
import Image from "next/image";
import { MdPeople, MdOutlineManageAccounts, MdHomeRepairService } from "react-icons/md";
import { HiOutlineWrenchScrewdriver, HiOutlineChatBubbleLeftRight, HiOutlineBolt } from "react-icons/hi2";
import { TbReportMoney } from "react-icons/tb";
import { PiRobotLight } from "react-icons/pi";
import { FaPoundSign } from "react-icons/fa";

const orbitIcons = [
  <MdPeople key="Tenants" />,
  <MdOutlineManageAccounts key="Management" />,
  <MdHomeRepairService key="Maintenance" />,
  <HiOutlineWrenchScrewdriver key="Repairs" />,
  <HiOutlineChatBubbleLeftRight key="Chat" />,
  <HiOutlineBolt key="AI" />,
  <TbReportMoney key="Finance" />,
  <PiRobotLight key="Assistant" />,
  <FaPoundSign key="Rent" />,
];

export default function OrbitGraphic() {
  const duration = 24;

  // Responsive values for mobile and desktop
  const mobile = {
    size: 260,
    logo: 80,
    logoImg: 60,
    radius: 90,
    center: 130,
    iconSize: 38,
    iconBox: 44,
    iconOffset: 22,
  };
  const desktop = {
    size: 360,
    logo: 110,
    logoImg: 80,
    radius: 140,
    center: 180,
    iconSize: 38,
    iconBox: 54,
    iconOffset: 27,
  };

  // Use a hook to detect screen size on client only
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const cfg = isMobile ? mobile : desktop;

  return (
    <div
      className="relative mx-auto"
      style={{
        width: `${cfg.size}px`,
        height: `${cfg.size}px`,
      }}
    >
      {/* Center logo */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg flex items-center justify-center"
        style={{ width: cfg.logo, height: cfg.logo }}
      >
        <Image src="/LogoWB.png" alt="MyPropertyPal Logo" width={cfg.logoImg} height={cfg.logoImg} />
      </div>
      {/* Orbiting icons in a rotating container */}
      <div
        className="absolute left-0 top-0 w-full h-full"
        style={{
          transformOrigin: "50% 50%",
          animation: `orbit-container ${duration}s linear infinite`,
        }}
      >
        {orbitIcons.map((Icon, i) => {
          const angle = (2 * Math.PI * i) / orbitIcons.length;
          const x = cfg.center + cfg.radius * Math.cos(angle) - cfg.iconOffset;
          const y = cfg.center + cfg.radius * Math.sin(angle) - cfg.iconOffset;
          return (
            <div
              key={i}
              className="absolute"
              style={{
                left: x,
                top: y,
                width: cfg.iconBox,
                height: cfg.iconBox,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "white",
                borderRadius: "9999px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                color: "#2563eb",
                transform: `rotate(${-angle * (180 / Math.PI)}deg)`,
              }}
            >
              <div
                style={{
                  transform: `rotate(${angle * (180 / Math.PI)}deg)`,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {React.cloneElement(Icon, { size: cfg.iconSize })}
              </div>
            </div>
          );
        })}
      </div>
      <style jsx>{`
        @keyframes orbit-container {
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}