/* eslint-disable @next/next/no-img-element */
"use client";
import { IAdmin } from "@/types/Admin";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Drawer from "../Drawer";
import { getAdminNotifications, readNotification } from "@/util";
import { toast } from "react-toastify";

interface IProps {
  section?: string;
}

interface IPageNotifications {
  id: string;
  type: "inquiry" | "booking" | "payment" | "review" | "admin" | "subscription";
  title: string;
  message: string;
  permission: number;
  meta?: Record<string, unknown>;
  read: boolean;
}

export default function Header({ section }: IProps) {
  const [user, setUser] = useState<IAdmin | null>(null);
  const [notifications, setNotifications] = useState<IPageNotifications[]>([]);
  const [defaultNotifications, setDefaultNotifications] = useState<
    IPageNotifications[]
  >([]);
  const [notificationSection, setNotificationSection] = useState("unread");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const fetchNotifications = async () => {
    try {
      const response = await getAdminNotifications();
      if (response) {
        setDefaultNotifications(response.notifications);
        setNotifications(response.notifications);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const fetchNotificationByInterval = async () => {
    try {
      const response = await getAdminNotifications();
      if (response) {
        const newNotifications: IPageNotifications[] = response.notifications;
        if (newNotifications.length !== defaultNotifications.length) {
          setDefaultNotifications(newNotifications);
        }
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const getNotificationTitle = (notification: IPageNotifications) => {
    switch (notification.type) {
      case "booking":
        return "Booking Alert";
      case "admin":
        return "New Admin Added";
      case "review":
        return "New Review";
      case "subscription":
        return "New Subscription";
      default:
        return "Unknown Notification";
    }
  };

  const getNotificationIcon = (notification: IPageNotifications) => {
    switch (notification.type) {
      case "booking":
        return "/icons/bookmark.svg";
      case "admin":
        return "/icons/profile.svg";
      case "review":
        return "/icons/directbox.svg";
      case "subscription":
        return "/icons/personalcard.svg";
      default:
        return "/icons/dashboard.svg";
    }
  };

  const handleReadNotification = async (notificationId: string) => {
    const toastId = toast.loading("Marking read...", {
      position: "bottom-right",
    });
    try {
      await readNotification({ id: notificationId });
      await fetchNotifications();
      toast.dismiss(toastId);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Error reading notification:", { position: "bottom-right" });
      toast.dismiss(toastId);
    }
  };

  const handleNotificationSection = (section: string) => {
    setNotificationSection(section);
    switch (section) {
      case "all":
        setNotifications(defaultNotifications);
        break;
      case "unread":
        setNotifications(
          defaultNotifications.filter(
            (notification) => notification.read === false,
          ),
        );
        break;
      case "read":
        setNotifications(
          defaultNotifications.filter(
            (notification) => notification.read === true,
          ),
        );
        break;
      default:
        setNotifications(defaultNotifications);
        break;
    }
  };

  useEffect(() => {
    setMounted(true);

    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("user");
      if (savedData) {
        try {
          setUser(JSON.parse(savedData));
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const intervalId = setInterval(fetchNotificationByInterval, 5000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <main className="w-full flex items-center justify-between py-4 px-5 border-b-[1px] border-[#E4E8E5] z-50">
        <section className="flex items-center gap-[188px]">
          <Link href={"/"} target="_blank">
            <img src={"/logo-black.svg"} alt="Logo" className="w-[67px]" />
          </Link>
          <h2 className="font-bold text-2xl leading-8 text-yard-primary mt-4">
            {section || "Admin Dashboard"}
          </h2>
        </section>
        <section className="flex items-center gap-5">
          <div className="w-[20px] h-[20px]" /> {/* Placeholder for search */}
          <div className="w-[20px] h-[20px]" />{" "}
          {/* Placeholder for notification */}
          <div className="w-[52px] h-[52px] hidden lg:block" />{" "}
          {/* Placeholder for profile */}
        </section>
      </main>
    );
  }

  return (
    <>
      <main className="w-full flex items-center justify-between py-4 px-5 border-b border-[#E4E8E5] z-50 bg-white sticky top-0">
        <section className="flex items-center gap-8 lg:gap-[188px]">
          <Link href={"/"} target="_blank" className="flex-shrink-0">
            <img
              src={"/logo-black.svg"}
              alt="Logo"
              className="w-[67px] h-auto"
            />
          </Link>
          <h2 className="font-bold text-lg lg:text-2xl leading-8 text-yard-primary mt-4 truncate">
            {section || "Admin Dashboard"}
          </h2>
        </section>

        <section className="flex items-center gap-3 lg:gap-5">
          {/* Search Icon */}
          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Search"
          >
            <Image
              src={"/icons/search.svg"}
              width={20}
              height={20}
              alt="Search Icon"
            />
          </button>

          {/* Notification Icon */}
          <button
            onClick={() => {
              setNotifications(
                defaultNotifications.filter(
                  (notification) => notification.read === false,
                ),
              );
              setIsDrawerOpen(true);
            }}
            className="p-2 hover:bg-gray-100 transition-colors relative cursor-pointer"
            aria-label="Notifications"
          >
            <Image
              src={"/icons/notification.svg"}
              width={20}
              height={20}
              alt="Notification Icon"
            />
            {/*Notification badge */}
            {defaultNotifications.filter(
              (notification) => notification.read === false,
            ).length > 0 && (
              <span className="absolute top-1 right-1 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-yard-primary opacity-75 animate-ping"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-yard-dark-primary"></span>
              </span>
            )}
          </button>

          {/* User Profile */}
          <Link
            href={"/admin/dashboard"}
            className="w-max h-[52px] lg:flex justify-center items-center bg-[#E4E8E5] text-yard-primary py-3 px-4 rounded-sm gap-2 hidden hover:bg-[#D5D9D6] transition-colors"
          >
            <div
              className="rounded-full w-[32px] h-[32px] bg-cover bg-center flex-shrink-0 border-2 border-white shadow-sm"
              style={{
                backgroundImage: `url(${user?.imageUrl || "/gallery/girl.svg"})`,
              }}
            />
            <span className="font-medium whitespace-nowrap">
              {user?.name?.split(" ")[0] || "User"} Profile
            </span>
          </Link>
        </section>
      </main>

      {/* Notification Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        width="w-full sm:w-[470px]"
        position="right"
      >
        <div className="w-full space-y-4">
          <section className="w-full">
            <div className="w-full flex items-center justify-between">
              <h2 className="font-semibold text-2xl leading-8 tracking-[0.1px] text-yard-primary">
                Notifications
              </h2>
              <div
                className="w-9 h-9 bg-[#EDF0EE] relative group flex justify-center items-center cursor-pointer rounded2px overflow-hidden"
                onClick={() => {
                  setNotificationSection("unread");
                  setIsDrawerOpen(false);
                }}
              >
                <img
                  src={"/icons/cancel.svg"}
                  alt="Close Icon"
                  className="z-40"
                />
                <span className="absolute top-0 left-0 bg-[#C7CFC9] w-full h-full transition-all duration-500 -translate-x-full group-hover:translate-x-0"></span>
              </div>
            </div>
          </section>

          <section className="flex items-center justify-between mt-8">
            <div className="flex items-center gap-7">
              <button
                className={`flex items-center ${notificationSection == "unread" ? "border-b-2" : ""} gap-1 pb-1 duration-700 hover:scale-105 cursor-pointer`}
                onClick={() => handleNotificationSection("unread")}
              >
                <p className="text-[16px] font-sen font-medium">Unread</p>
                <span className="w-5 h-5 flex justify-center items-center rounded2px text-[#F1F1F0] p-1 bg-[#1A231C] font-sen font-medium text-xs leading-[24px] tracking-[0.4px]">
                  {
                    defaultNotifications.filter(
                      (notification) => notification.read === false,
                    ).length
                  }
                </span>
              </button>

              <button
                className={`flex items-center ${notificationSection == "read" ? "border-b-2" : ""} gap-1 pb-1 duration-700 hover:scale-105 cursor-pointer`}
                onClick={() => handleNotificationSection("read")}
              >
                <p className="text-[16px] font-sen font-medium">Read</p>
                <span className="w-5 h-5 flex justify-center items-center rounded2px text-[#F1F1F0] p-1 bg-[#1A231C] font-sen font-medium text-xs leading-[24px] tracking-[0.4px]">
                  {
                    defaultNotifications.filter(
                      (notification) => notification.read === true,
                    ).length
                  }
                </span>
              </button>

              <button
                className={`flex items-center ${notificationSection == "all" ? "border-b-2" : ""} gap-1 pb-1 duration-700 hover:scale-105 cursor-pointer`}
                onClick={() => handleNotificationSection("all")}
              >
                <p className="text-[16px] font-sen font-medium">All</p>
                <span className="w-5 h-5 flex justify-center items-center rounded2px text-[#F1F1F0] p-1 bg-[#1A231C] font-sen font-medium text-xs leading-[24px] tracking-[0.4px]">
                  {defaultNotifications.length}
                </span>
              </button>
            </div>
            {defaultNotifications.filter(
              (notification) => notification.read === false,
            ).length > 0 && (
              <button
                type="button"
                className="flex items-center gap-1 cursor-pointer duration-500 hover:scale-105"
                onClick={() => handleReadNotification("all")}
              >
                <p className="text-[16px] font-sen font-medium">Read all</p>
              </button>
            )}
          </section>

          {/*Main Notification*/}
          <section className="w-full flex flex-col">
            {notifications.length > 0 ? (
              notifications.toReversed().map((notification) => {
                const title = getNotificationTitle(notification);
                const icon = getNotificationIcon(notification);
                return (
                  <div
                    key={notification.id as string}
                    onClick={() =>
                      handleReadNotification(notification.id as string)
                    }
                    className={`w-full rounded-lg ${notification.read ? "bg-base-100" : "bg-[#E4E8E5]"} py-4 px-2 mt-4 cursor-pointer duration-500 hover:skew-y-1`}
                  >
                    <div className="title flex gap-2 items-start">
                      <Image
                        src={icon}
                        width={18}
                        height={18}
                        className="mt-1"
                        alt="Profile"
                      />
                      <div>
                        <h2 className="text-yard-primary font-bold font-lato text-lg leading-[24px] tracking-[0.4px]">
                          {title}
                        </h2>
                        <p className="text-sm text-[#717068] font-lato leading-[22px] tracking-[0.5px]">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Image
                    src="/icons/notification.svg"
                    width={24}
                    height={24}
                    alt="No notifications"
                  />
                </div>
                <p className="text-gray-500 text-sm">No new notifications</p>
              </div>
            )}
          </section>
        </div>
      </Drawer>
    </>
  );
}
