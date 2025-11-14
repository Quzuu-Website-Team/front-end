"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import UserDropdown from "./UserDropdown"
import { cn } from "@/lib/utils"
import Image from "next/image"
import NavbarMenu from "./NavbarMenu"

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 40) {
                setIsScrolled(true)
            } else {
                setIsScrolled(false)
            }
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <>
            <nav
                className={cn(
                    "navbar fixed z-50 w-screen py-5 text-slate-900",
                    isScrolled &&
                        "bg-white/60 backdrop-blur-lg shadow-sm transition-all ease-out",
                )}
            >
                <div className="items-center px-4 container mx-auto md:flex md:px-8 gap-4">
                    <div className="relative z-[110] flex items-center justify-between md:block">
                        <Link href="/" className="inline-block">
                            {/* <h1 className="text-4xl font-semibold">Quzuu</h1> */}
                            <Image
                                src="/assets/img/logo-transparent.png"
                                alt="Logo Quzuu"
                                className="w-auto object-contain"
                                width={100}
                                height={56}
                                priority
                            />
                        </Link>
                        <div className="md:hidden">
                            <button
                                className="text-slate-500 outline-none p-2 rounded-md"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                <Menu />
                            </button>
                        </div>
                    </div>
                    <div
                        className={cn(
                            `basis-3/4 flex-1 justify-self-center pb-8 max-md:absolute max-md:z-[100] max-md:transform md:block md:pb-0 md:mt-0 transition-all max-md:bg-white max-md:w-svw`,
                            isOpen
                                ? "max-md:translate-y-0"
                                : "max-md:-translate-y-[200%]",
                        )}
                    >
                        <div className="flex flex-col-reverse md:flex-row justify-center md:justify-end items-center space-y-8 md:space-y-0 gap-4 md:gap-6 xl:gap-20">
                            <NavbarMenu />
                            {/* User dropdown or login/register buttons */}
                            <div>
                                <UserDropdown />
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar
