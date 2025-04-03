"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import Image from "next/image"
import { Fragment, useState } from 'react'
import { Menu, Transition, Dialog } from '@headlessui/react'
import { FcGoogle } from "react-icons/fc";
import { IoIosLogOut } from "react-icons/io";


export default function UserButton() {
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  if (status === "loading") return null

  return (
    <div className="flex items-center justify-end gap-4 ml-auto bg-gray-100 fixed top-3 right-6">
      {session ? (
        <Menu as="div" className="relative">
          <Menu.Button className="hover:opacity-75 transition-opacity">
            <Image
              src={session.user?.image ?? "/avatar-placeholder.png"}
              alt="User avatar"
              width={40}
              height={40}
              className="rounded-full"
            />
          </Menu.Button>
          
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => signOut()}
                    className={`${
                      active ? 'bg-gray-100' : ''
                    } block px-4 py-2 text-sm text-gray-700 w-full text-left rounded-md`}
                  >
                    <IoIosLogOut className="inline-block mr-1 w-5 h-5" />
                    Sign out
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      ) : (
        <>
          <button
            onClick={() => setIsOpen(true)}
            className="px-4 py-2 text-black bg-white border rounded-md hover:bg-gray-50"
          >
            <span className="text-sm font-medium">Sign in</span>
          </button>

          <Dialog
            open={isOpen}
            onClose={() => setIsOpen(false)}
            className="relative z-50"
          >
            {/* Modal content */}
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-sm p-6 bg-white rounded-lg">
                <Dialog.Title className="mb-6 text-lg font-semibold text-center">
                  Sign in to Continue
                </Dialog.Title>
                <button
                  onClick={() => signIn("google")}
                  className="flex items-center justify-center w-full gap-2 px-4 py-2 text-black transition-colors bg-white border rounded-md hover:bg-gray-50"
                >
                  <FcGoogle className="w-5 h-5" />
                  <span className="text-sm">Continue with Google</span>
                </button>
              </Dialog.Panel>
            </div>
          </Dialog>
        </>
      )}
    </div>
  )
}