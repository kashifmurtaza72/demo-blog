import { Footer } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";
import {BsFacebook, BsInstagram, BsTwitter, BsGithub} from "react-icons/bs";

export default function FooterCom() {
  return (
    <Footer container className="border border-t-8 border-teal-500">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          <div className="">
            <Link
              to="/"
              className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold  dark:text-white"
            >
              <span className="px-2 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                M Ali Blog
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-5 mt-4">

            <div>
                <Footer.Title title="About" />
                <Footer.LinkGroup col>
                    <Footer.Link href="/projects" target="_blank">Projects</Footer.Link>
                    <Footer.Link href="/about" target="_blank">About us</Footer.Link>
                    <Footer.Link href="/privacy" target="_blank">Privacy</Footer.Link>

                </Footer.LinkGroup>
            </div>

            <div>
                <Footer.Title title="Follow Us" />
                <Footer.LinkGroup col>
                    <Footer.Link href="/" target="_blank">GitHub</Footer.Link>
                    <Footer.Link href="/" target="_blank">LinkedIn</Footer.Link>

                </Footer.LinkGroup>
            </div>

            <div>
                <Footer.Title title="Legal Information" />
                <Footer.LinkGroup col>
                    <Footer.Link href="/" target="_blank">Privacy</Footer.Link>
                    <Footer.Link href="/" target="_blank">Terms & conditions</Footer.Link>

                </Footer.LinkGroup>
            </div>

          </div>
        </div>

        <Footer.Divider />

        <div className="w-full sm:flex sm:items-center sm:justify-between">
            <Footer.Copyright href="#" by="M Ali Blog" year={new Date().getFullYear()} />

            <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
                <Footer.Icon href="#" icon={BsFacebook} />

                <Footer.Icon href="#" icon={BsInstagram} />

                <Footer.Icon href="#" icon={BsTwitter} />

                <Footer.Icon href="#" icon={BsGithub} />


            </div>
        </div>
      </div>
    </Footer>
  );
}
