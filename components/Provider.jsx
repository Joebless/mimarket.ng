"use client";
import { SessionProvider } from "next-auth/react";

/**
 * CustomAuthProvider Component
 *
 * @param {Object} props - Component properties
 * @param {Object} props.userSession - The user session object from NextAuth
 * @param {ReactNode} props.children - The child components to be wrapped by the provider
 */
const CustomAuthProvider = ({ children, userSession }) => {
  return (
    // Provide user session information to the SessionProvider
    <SessionProvider session={userSession}>{children}</SessionProvider>
  );
};

export default CustomAuthProvider;
