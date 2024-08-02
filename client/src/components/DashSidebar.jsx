import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiArrowSmRight, HiUser } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

export default function DashSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log("Error signing out");
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };
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
            <Link to="#" onClick={handleSignout}>Logout</Link>
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>


    </Sidebar>
  );
}
