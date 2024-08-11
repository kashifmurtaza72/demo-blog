import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiUser, HiArrowSmRight, HiDocumentText } from "react-icons/hi";
import { signoutFailure, signoutSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
export default function DashSidebar() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const URLParams = new URLSearchParams(location.search);
    const tabFromUrl = URLParams.get("tab");

    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  const handleSignout = async () => {
    try {
      const res = await fetch(`/api/user/signout`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        dispatch(signoutFailure(data.message));
      } else {
        dispatch(signoutSuccess(data));
      }
    } catch (error) {
      dispatch(signoutFailure("Failed to sign out. Please try again later."));
    }
  };
  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              as={"div"}
              label={currentUser.isAdmin ? "Admin" : "User"}
            >
              Profile
            </Sidebar.Item>
          </Link>
        </Sidebar.ItemGroup>
      </Sidebar.Items>

      {currentUser.isAdmin && (
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Sidebar.Item
              active={tab === "posts"}
              icon={HiDocumentText}
              labelColor="dark"
            >
              <Link to="/dashboard?tab=posts">Posts</Link>
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      )}
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item icon={HiArrowSmRight} as={"div"}>
            <Link to="#" onClick={handleSignout}>
              Signout
            </Link>
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
