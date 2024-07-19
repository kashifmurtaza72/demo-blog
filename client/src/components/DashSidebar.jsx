import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiArrowSmRight, HiUser } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";

export default function DashSidebar() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <Sidebar>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item active={tab === "profile"} as={'div'} icon={HiUser}>
            <Link to="/dashboard?tab=profile" >Profile</Link>
          </Sidebar.Item>
        </Sidebar.ItemGroup>


        <Sidebar.ItemGroup>
          <Sidebar.Item active={tab === "logout"} as={'div'} icon={HiArrowSmRight}>
            <Link to="#" >Logout</Link>
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>


    </Sidebar>
  );
}
