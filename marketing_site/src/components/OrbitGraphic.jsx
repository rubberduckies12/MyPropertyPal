import Image from "next/image";
import { MdPeople, MdOutlineManageAccounts, MdHomeRepairService } from "react-icons/md";
import { HiOutlineWrenchScrewdriver, HiOutlineChatBubbleLeftRight, HiOutlineBolt } from "react-icons/hi2";
import { TbReportMoney } from "react-icons/tb";
import { PiRobotLight } from "react-icons/pi";
import { FaPoundSign } from "react-icons/fa";

const orbitIcons = [
  { icon: <MdPeople size={38} />, label: "Tenants" },
  { icon: <MdOutlineManageAccounts size={38} />, label: "Management" },
  { icon: <MdHomeRepairService size={38} />, label: "Maintenance" },
  { icon: <HiOutlineWrenchScrewdriver size={38} />, label: "Repairs" },
  { icon: <HiOutlineChatBubbleLeftRight size={38} />, label: "Chat" },
  { icon: <HiOutlineBolt size={38} />, label: "AI" },
  { icon: <TbReportMoney size={38} />, label: "Finance" },
  { icon: <PiRobotLight size={38} />, label: "Assistant" },
  { icon: <FaPoundSign size={38} />, label: "Rent" },
];

export default function OrbitGraphic() {
  // Arrange icons in a circle
  const radius = 140;
  const center = 180;
  return (
    <div className="relative w-[360px] h-[360px] mx-auto">
      {/* Center logo */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg flex items-center justify-center" style={{ width: 120, height: 120 }}>
        <Image src="/LogoWB.png" alt="MyPropertyPal Logo" width={90} height={90} />
      </div>
      {/* Orbiting icons */}
      {orbitIcons.map((item, i) => {
        const angle = (2 * Math.PI * i) / orbitIcons.length;
        const x = center + radius * Math.cos(angle) - 32;
        const y = center + radius * Math.sin(angle) - 32;
        return (
          <div
            key={item.label}
            className="absolute flex flex-col items-center"
            style={{
              left: x,
              top: y,
              width: 64,
              height: 64,
            }}
          >
            <div className="bg-white rounded-full shadow p-2 flex items-center justify-center text-[#2563eb]">{item.icon}</div>
            <span className="text-xs text-gray-700 mt-1 text-center w-16">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}