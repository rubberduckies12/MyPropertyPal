import Image from "next/image";
import { MdPeople, MdOutlineManageAccounts, MdHomeRepairService } from "react-icons/md";
import { HiOutlineWrenchScrewdriver, HiOutlineChatBubbleLeftRight, HiOutlineBolt } from "react-icons/hi2";
import { TbReportMoney } from "react-icons/tb";
import { PiRobotLight } from "react-icons/pi";
import { FaPoundSign } from "react-icons/fa";

const orbitIcons = [
  <MdPeople size={38} key="Tenants" />,
  <MdOutlineManageAccounts size={38} key="Management" />,
  <MdHomeRepairService size={38} key="Maintenance" />,
  <HiOutlineWrenchScrewdriver size={38} key="Repairs" />,
  <HiOutlineChatBubbleLeftRight size={38} key="Chat" />,
  <HiOutlineBolt size={38} key="AI" />,
  <TbReportMoney size={38} key="Finance" />,
  <PiRobotLight size={38} key="Assistant" />,
  <FaPoundSign size={38} key="Rent" />,
];

export default function OrbitGraphic() {
  const radius = 140;
  const center = 180;
  const duration = 24; // seconds for a full orbit

  return (
    <div className="relative w-[360px] h-[360px] mx-auto">
      {/* Center logo */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg flex items-center justify-center"
        style={{ width: 120, height: 120 }}
      >
        <Image src="/LogoWB.png" alt="MyPropertyPal Logo" width={90} height={90} />
      </div>
      {/* Orbiting icons in a rotating container */}
      <div
        className="absolute left-0 top-0 w-full h-full"
        style={{
          transformOrigin: "50% 50%",
          animation: `orbit-container ${duration}s linear infinite`,
        }}
      >
        {orbitIcons.map((icon, i) => {
          const angle = (2 * Math.PI * i) / orbitIcons.length;
          const x = center + radius * Math.cos(angle) - 32;
          const y = center + radius * Math.sin(angle) - 32;
          return (
            <div
              key={i}
              className="absolute"
              style={{
                left: x,
                top: y,
                width: 64,
                height: 64,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "white",
                borderRadius: "9999px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                color: "#2563eb",
                // Counter-rotate each icon so it stays upright
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
                {icon}
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